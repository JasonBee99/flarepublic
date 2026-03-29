'use client'
// src/app/(frontend)/resources/personality-profile/PersonalityTest.tsx
// Interactive Personality Profile test based on the Personality Plus framework
// by Fred Littauer. Three tabs: Take the test, My Results, Team Comparison.

import React, { useState, useCallback, useEffect } from 'react'
import { ChevronDown, Copy, Check, UserPlus, RotateCcw, Users, ClipboardList, BarChart3 } from 'lucide-react'
import { PersonalityGuide } from '@/components/PersonalityGuide'

// ── Types ────────────────────────────────────────────────────────────────────

type TypeKey = 'S' | 'C' | 'M' | 'P'
type Tab = 'test' | 'results' | 'team'

interface WordDef {
  w: string
  t: TypeKey
}

interface Row {
  n: number
  words: WordDef[]
}

interface TypeScores {
  str: number
  wk: number
}

interface Scores {
  S: TypeScores
  C: TypeScores
  M: TypeScores
  P: TypeScores
}

interface Totals {
  S: number
  C: number
  M: number
  P: number
}

interface TeamMember {
  name: string
  scores: Totals
}

// ── Data ─────────────────────────────────────────────────────────────────────

const DEFS: Record<string, string> = {
  Adventurous: 'Takes on new, daring enterprises with a determination to master them.',
  Adaptable: 'Easily fits and is comfortable in any situation.',
  Animated: 'Full of life, lively use of hand, arm, and face gestures.',
  Analytical: 'Likes to examine the parts for their logical and proper relationships.',
  Persistent: 'Sees one project through to completion before starting another.',
  Playful: 'Full of fun and good humor.',
  Persuasive: 'Convinces through logic and fact rather than charm or power.',
  Peaceful: 'Seems undisturbed and tranquil; retreats from any form of strife.',
  Submissive: 'Easily accepts any point of view with little need to assert opinion.',
  'Self-sacrificing': 'Willingly gives up personal being for the sake of meeting the needs of others.',
  Sociable: 'Sees being with others as an opportunity to be cute and entertaining.',
  'Strong-willed': 'Determined to have his or her own way.',
  Considerate: 'Having regard for the needs and feelings of others.',
  Controlled: 'Has emotional feelings but rarely displays them.',
  Competitive: 'Turns every situation into a contest and always plays to win.',
  Convincing: 'Can win you over to anything through the sheer charm of his personality.',
  Refreshing: 'Renews and stimulates or makes others feel good.',
  Respectful: 'Treats others with deference, honor, and esteem.',
  Reserved: 'Self restraint in expression of emotion or enthusiasm.',
  Resourceful: 'Able to act quickly and effectively in virtually all situations.',
  Satisfied: 'A person who easily accepts any circumstance or situation.',
  Sensitive: 'Intensively cares about others and what happens.',
  'Self-reliant': 'An independent person who can fully rely on own capabilities, judgment, and resources.',
  Spirited: 'Full of life and excitement.',
  Planner: 'Prefers to work out a detailed arrangement beforehand for the accomplishment of a project or goal.',
  Patient: 'Unmoved by delay; remains calm and tolerant.',
  Positive: 'Knows it will turn out right if he is in charge.',
  Promoter: 'Urges or compels others to go along, join, or invest through the charm of his own personality.',
  Sure: 'Confident, rarely hesitates or wavers.',
  Spontaneous: 'Prefers all of life to be impulsive, unpremeditated activity.',
  Scheduled: 'Makes and lives according to a daily plan; dislikes his plan to be interrupted.',
  Shy: "Quiet; doesn't easily instigate a conversation.",
  Orderly: 'A person who has a methodical, systematic arrangement of things.',
  Obliging: "Accommodating; one who is quick to do it another's way.",
  Outspoken: 'Speaks frankly and without reserve.',
  Optimistic: 'Sunny disposition who convinces himself and others that everything will turn out right.',
  Friendly: 'A responder rather than an initiator; seldom starts a conversation.',
  Faithful: 'Consistently reliable, steadfast, loyal, and devoted sometimes beyond reason.',
  Funny: 'Sparkling sense of humor that can make virtually any story into a hilarious event.',
  Forceful: 'A commanding personality whom others would hesitate to take a stand against.',
  Daring: 'Willing to take risks; fearless, bold.',
  Delightful: 'A person who is upbeat and fun to be with.',
  Diplomatic: 'Deals with people tactfully, sensitively, and patiently.',
  Detailed: 'Does everything in proper order with a clear memory of all the things that happened.',
  Cheerful: 'Consistently in good spirits and promoting happiness in others.',
  Confident: 'Self-assured and certain of own ability and success.',
  Consistent: 'Stays emotionally on an even keel, responding as one might expect.',
  Cultured: 'Interests involve both intellectual and artistic pursuits such as theatre, symphony, and ballet.',
  Idealistic: 'Visualizes things in their perfect form and has a need to measure up to that standard.',
  Independent: 'Self-sufficient, self-supporting, self-confident; seems to have little need of help.',
  Inoffensive: 'A person who never says or causes anything unpleasant or objectionable.',
  Inspiring: 'Encourages others to work, join, or be involved and makes the whole thing fun.',
  Demonstrative: "Openly expresses emotion, especially affection; doesn't hesitate to touch others while speaking.",
  Decisive: 'A person with quick, conclusive, judgment-making ability.',
  'Dry humor': 'Exhibits dry wit; usually humorous one-liners which can be sarcastic in nature.',
  Deep: 'Intense and often introspective with a distaste for surface conversation and pursuits.',
  Mediator: 'Consistently finds himself in the role of reconciling differences in order to avoid conflict.',
  Musical: 'Participates in or has a deep appreciation for music; is committed to music as an artform.',
  Mover: 'Driven by a need to be productive; is a leader whom others follow.',
  'Mixes easily': "Loves a party and can't wait to meet everyone in the room; never meets a stranger.",
  Thoughtful: 'A considerate person who remembers special occasions and is quick to make a kind gesture.',
  Tenacious: "Holds on firmly, stubbornly, and won't let go until the goal is accomplished.",
  Talker: 'Constantly talking, generally telling funny stories and entertaining everyone around.',
  Tolerant: "Easily accepts the thoughts and ways of others without the need to disagree or change them.",
  Listener: 'Always seems willing to hear what you have to say.',
  Loyal: 'Faithful to a person, ideal, or job; sometimes beyond reason.',
  Leader: 'A natural born director; driven to be in charge; often finds it difficult to believe others can do the job.',
  Lively: 'Full of life, vigorous, energetic.',
  Contented: 'Easily satisfied with what he has; rarely envious.',
  Chief: 'Commands leadership and expects people to follow.',
  Chartmaker: 'Organizes life, tasks, and problem solving by making lists, forms, or graphs.',
  Cute: 'Precious, adorable, center of attention.',
  Perfectionist: 'Places high standards on himself and often on others; desires that everything be in proper order at all times.',
  Pleasant: 'Easy going, easy to be around, easy to talk with.',
  Productive: 'Must constantly be working or achieving; often finds it very difficult to rest.',
  Popular: 'Life of the party and therefore much desired as a party guest.',
  Bouncy: 'A bubbly, lively personality, full of energy.',
  Bold: 'Fearless, daring, forward, unafraid of risk.',
  Behaved: 'Consistently desires to conduct himself within the realm of what he feels is proper.',
  Balanced: 'Stable, middle of the road personality; not subject to sharp highs or lows.',
  Blank: 'A person who shows little facial expression or emotion.',
  Bashful: 'Shrinks from getting attention, resulting from self-consciousness.',
  Brassy: 'Showy, flashy, comes on strong, too loud.',
  Bossy: 'Commanding, domineering, sometimes overbearing in adult relationships.',
  Undisciplined: "A person whose lack of order permeates most every area of his life.",
  Unsympathetic: 'Finds it difficult to relate to the problems or hurts of others.',
  Unenthusiastic: "Tends to not get excited, often feeling it won't work anyway.",
  Unforgiving: 'One who has difficulty releasing or forgiving a hurt or injustice done to them.',
  Reticent: 'Unwilling or struggles against getting involved, especially when complex.',
  Resentful: 'Often holds ill feelings as a result of real or imagined offenses.',
  Resistant: 'Strives, works against, or hesitates to accept any other way but his own.',
  Repetitious: 'Retells stories and incidents to entertain without realizing he has already told the story several times.',
  Fussy: 'Insistent over petty matters or details; calling for great attention to trivial details.',
  Fearful: 'Often experiences feelings of deep concern, apprehension, or anxiousness.',
  Forgetful: "Lack of memory which is usually tied to a lack of discipline and not bothering to mentally record things that aren't fun.",
  Frank: "Straightforward, outspoken; doesn't mind telling you exactly what he thinks.",
  Impatient: 'A person who finds it difficult to endure irritation or wait for others.',
  Insecure: 'One who is apprehensive or lacks confidence.',
  Indecisive: 'The person who finds it difficult to make any decision at all.',
  Interrupts: 'A person who is more of a talker than a listener; starts speaking without even realizing someone else is already speaking.',
  Unpopular: "A person whose intensity and demand for perfection can push others away.",
  Uninvolved: 'Has no desire to listen or become interested in clubs, groups, activities, or other people\'s lives.',
  Unpredictable: 'May be ecstatic one moment and down the next; willing to help but then disappears.',
  Unaffectionate: 'Finds it difficult to verbally or physically demonstrate tenderness openly.',
  Headstrong: 'Insists on having his own way.',
  Haphazard: 'Has no consistent way of doing things.',
  'Hard to please': "A person whose standards are set so high that it is difficult to ever satisfy them.",
  Hesitant: 'Slow to get moving and hard to get involved.',
  Plain: 'A middle-of-the-road personality without highs or lows, and showing little, if any, emotion.',
  Pessimistic: 'While hoping for the best, this person generally sees the down side of a situation first.',
  Proud: 'One with great self-esteem who sees himself as always right and the best person for the job.',
  Permissive: 'Allows others (including children) to do as they please in order to keep from being disliked.',
  'Angered easily': 'One who has a childlike flash-in-the-pan temper that expresses itself in tantrum style.',
  Aimless: 'Not a goal-setter with little desire to be one.',
  Argumentative: 'Incites arguments generally because he is certain he is right no matter what the situation may be.',
  Alienated: "Easily feels estranged from others often because of insecurity or fear that others don't really enjoy his company.",
  'Naïve': 'Simple and child-like perspective, lacking sophistication or comprehension of what the deeper levels of life are really about.',
  'Negative attitude': "One whose attitude is seldom positive and is often able to see only the down or dark side of each situation.",
  Nervy: 'Full of confidence, fortitude, and sheer guts, often in a negative sense.',
  Nonchalant: 'Easy-going, unconcerned, indifferent.',
  'Wants credit': 'Thrives on the credit or approval of others. As an entertainer this person feeds on the applause.',
  Workaholic: 'An aggressive goal-setter who must be constantly productive; feels very guilty when resting.',
  Withdrawn: 'A person who pulls back to himself and needs a great deal of alone or isolation time.',
  Worrier: 'Consistently feels uncertain, troubled, or anxious.',
  'Too sensitive': 'Overly introspective and easily offended when misunderstood.',
  Tactless: 'Sometimes expresses himself in a somewhat offensive and inconsiderate way.',
  Timid: 'Shrinks from difficult situations.',
  Talkative: 'An entertaining, compulsive talker who finds it difficult to listen.',
  Doubtful: 'Characterized by uncertainty and lack of confidence that it will ever work out.',
  Disorganized: 'Lacks ability to ever get life in order.',
  Domineering: 'Compulsively takes control of situations and/or people; usually telling others what to do.',
  Depressed: 'A person who feels down much of the time.',
  Inconsistent: 'Erratic, contradictory, with actions and emotions not based on logic.',
  Intolerant: "Appears unable to withstand or accept another's attitudes, point of view, or way of doing things.",
  Introvert: 'A person whose thoughts and interest are directed inward; lives within himself.',
  Indifferent: "A person to whom most things don't matter one way or the other.",
  Messy: 'Living in a state of disorder; unable to find things.',
  Moody: "Doesn't get very high emotionally, but easily slips into low lows when feeling unappreciated.",
  Mumbles: "Will talk quietly under the breath when pushed; doesn't bother to speak clearly.",
  Manipulative: 'Influences or manages shrewdly or deviously for his own advantage; will get his way somehow.',
  'Show-off': 'Needs to be the center of attention; wants to be watched.',
  Stubborn: 'Determined to exert his own will; not easily persuaded, obstinate.',
  Skeptical: 'Disbelieving; questioning the motive behind the words.',
  Slow: "Doesn't often act or think quickly; too much of a bother.",
  Loner: 'Requires a lot of private time and tends to avoid other people.',
  'Lord over others': "Doesn't hesitate to let you know that he is right or is in control.",
  Lazy: 'Evaluates work or activity in terms of how much energy it will take.',
  Loud: 'A person whose laugh or voice can be heard above others in the room.',
  Sluggish: 'Slow to get started; needs push to be motivated.',
  Suspicious: 'Tends to suspect or distrust others or ideas.',
  'Short-tempered': 'Has a demanding impatience-based anger and a short fuse.',
  Scatterbrained: 'Lacks the power of concentration or attention; flighty.',
  Revengeful: 'Knowingly or otherwise holds a grudge and punishes the offender.',
  Restless: "Likes constant new activity because it isn't fun to do the same things all the time.",
  Reluctant: 'Unwilling or struggles against getting involved.',
  Rash: 'May act hastily, without thinking things through, generally because of impatience.',
  Compromising: 'Will often relax his position, even when right, in order to avoid conflict.',
  Critical: 'Constantly evaluating and making judgments; frequently thinking or expressing negative reactions.',
  Crafty: 'Shrewd; one who can always find a way to get to the desired end.',
  Changeable: 'A child-like, short attention span that needs a lot of change and variety to keep from getting bored.',
}

const ROWS: Row[] = [
  { n: 1,  words: [{ w: 'Animated', t: 'S' }, { w: 'Adventurous', t: 'C' }, { w: 'Analytical', t: 'M' }, { w: 'Adaptable', t: 'P' }] },
  { n: 2,  words: [{ w: 'Playful', t: 'S' }, { w: 'Persuasive', t: 'C' }, { w: 'Persistent', t: 'M' }, { w: 'Peaceful', t: 'P' }] },
  { n: 3,  words: [{ w: 'Sociable', t: 'S' }, { w: 'Strong-willed', t: 'C' }, { w: 'Self-sacrificing', t: 'M' }, { w: 'Submissive', t: 'P' }] },
  { n: 4,  words: [{ w: 'Convincing', t: 'S' }, { w: 'Competitive', t: 'C' }, { w: 'Considerate', t: 'M' }, { w: 'Controlled', t: 'P' }] },
  { n: 5,  words: [{ w: 'Refreshing', t: 'S' }, { w: 'Resourceful', t: 'C' }, { w: 'Respectful', t: 'M' }, { w: 'Reserved', t: 'P' }] },
  { n: 6,  words: [{ w: 'Spirited', t: 'S' }, { w: 'Self-reliant', t: 'C' }, { w: 'Sensitive', t: 'M' }, { w: 'Satisfied', t: 'P' }] },
  { n: 7,  words: [{ w: 'Promoter', t: 'S' }, { w: 'Positive', t: 'C' }, { w: 'Planner', t: 'M' }, { w: 'Patient', t: 'P' }] },
  { n: 8,  words: [{ w: 'Spontaneous', t: 'S' }, { w: 'Sure', t: 'C' }, { w: 'Scheduled', t: 'M' }, { w: 'Shy', t: 'P' }] },
  { n: 9,  words: [{ w: 'Optimistic', t: 'S' }, { w: 'Outspoken', t: 'C' }, { w: 'Orderly', t: 'M' }, { w: 'Obliging', t: 'P' }] },
  { n: 10, words: [{ w: 'Funny', t: 'S' }, { w: 'Forceful', t: 'C' }, { w: 'Faithful', t: 'M' }, { w: 'Friendly', t: 'P' }] },
  { n: 11, words: [{ w: 'Delightful', t: 'S' }, { w: 'Daring', t: 'C' }, { w: 'Detailed', t: 'M' }, { w: 'Diplomatic', t: 'P' }] },
  { n: 12, words: [{ w: 'Cheerful', t: 'S' }, { w: 'Confident', t: 'C' }, { w: 'Cultured', t: 'M' }, { w: 'Consistent', t: 'P' }] },
  { n: 13, words: [{ w: 'Inspiring', t: 'S' }, { w: 'Independent', t: 'C' }, { w: 'Idealistic', t: 'M' }, { w: 'Inoffensive', t: 'P' }] },
  { n: 14, words: [{ w: 'Demonstrative', t: 'S' }, { w: 'Decisive', t: 'C' }, { w: 'Deep', t: 'M' }, { w: 'Dry humor', t: 'P' }] },
  { n: 15, words: [{ w: 'Mixes easily', t: 'S' }, { w: 'Mover', t: 'C' }, { w: 'Musical', t: 'M' }, { w: 'Mediator', t: 'P' }] },
  { n: 16, words: [{ w: 'Talker', t: 'S' }, { w: 'Tenacious', t: 'C' }, { w: 'Thoughtful', t: 'M' }, { w: 'Tolerant', t: 'P' }] },
  { n: 17, words: [{ w: 'Lively', t: 'S' }, { w: 'Leader', t: 'C' }, { w: 'Loyal', t: 'M' }, { w: 'Listener', t: 'P' }] },
  { n: 18, words: [{ w: 'Cute', t: 'S' }, { w: 'Chief', t: 'C' }, { w: 'Chartmaker', t: 'M' }, { w: 'Contented', t: 'P' }] },
  { n: 19, words: [{ w: 'Popular', t: 'S' }, { w: 'Productive', t: 'C' }, { w: 'Perfectionist', t: 'M' }, { w: 'Pleasant', t: 'P' }] },
  { n: 20, words: [{ w: 'Bouncy', t: 'S' }, { w: 'Bold', t: 'C' }, { w: 'Behaved', t: 'M' }, { w: 'Balanced', t: 'P' }] },
  { n: 21, words: [{ w: 'Brassy', t: 'S' }, { w: 'Bossy', t: 'C' }, { w: 'Bashful', t: 'M' }, { w: 'Blank', t: 'P' }] },
  { n: 22, words: [{ w: 'Undisciplined', t: 'S' }, { w: 'Unsympathetic', t: 'C' }, { w: 'Unforgiving', t: 'M' }, { w: 'Unenthusiastic', t: 'P' }] },
  { n: 23, words: [{ w: 'Repetitious', t: 'S' }, { w: 'Resistant', t: 'C' }, { w: 'Resentful', t: 'M' }, { w: 'Reticent', t: 'P' }] },
  { n: 24, words: [{ w: 'Forgetful', t: 'S' }, { w: 'Frank', t: 'C' }, { w: 'Fussy', t: 'M' }, { w: 'Fearful', t: 'P' }] },
  { n: 25, words: [{ w: 'Interrupts', t: 'S' }, { w: 'Impatient', t: 'C' }, { w: 'Insecure', t: 'M' }, { w: 'Indecisive', t: 'P' }] },
  { n: 26, words: [{ w: 'Unpredictable', t: 'S' }, { w: 'Unaffectionate', t: 'C' }, { w: 'Unpopular', t: 'M' }, { w: 'Uninvolved', t: 'P' }] },
  { n: 27, words: [{ w: 'Haphazard', t: 'S' }, { w: 'Headstrong', t: 'C' }, { w: 'Hard to please', t: 'M' }, { w: 'Hesitant', t: 'P' }] },
  { n: 28, words: [{ w: 'Permissive', t: 'S' }, { w: 'Proud', t: 'C' }, { w: 'Pessimistic', t: 'M' }, { w: 'Plain', t: 'P' }] },
  { n: 29, words: [{ w: 'Angered easily', t: 'S' }, { w: 'Argumentative', t: 'C' }, { w: 'Alienated', t: 'M' }, { w: 'Aimless', t: 'P' }] },
  { n: 30, words: [{ w: 'Naïve', t: 'S' }, { w: 'Nervy', t: 'C' }, { w: 'Negative attitude', t: 'M' }, { w: 'Nonchalant', t: 'P' }] },
  { n: 31, words: [{ w: 'Wants credit', t: 'S' }, { w: 'Workaholic', t: 'C' }, { w: 'Withdrawn', t: 'M' }, { w: 'Worrier', t: 'P' }] },
  { n: 32, words: [{ w: 'Talkative', t: 'S' }, { w: 'Tactless', t: 'C' }, { w: 'Too sensitive', t: 'M' }, { w: 'Timid', t: 'P' }] },
  { n: 33, words: [{ w: 'Disorganized', t: 'S' }, { w: 'Domineering', t: 'C' }, { w: 'Depressed', t: 'M' }, { w: 'Doubtful', t: 'P' }] },
  { n: 34, words: [{ w: 'Inconsistent', t: 'S' }, { w: 'Intolerant', t: 'C' }, { w: 'Introvert', t: 'M' }, { w: 'Indifferent', t: 'P' }] },
  { n: 35, words: [{ w: 'Messy', t: 'S' }, { w: 'Manipulative', t: 'C' }, { w: 'Moody', t: 'M' }, { w: 'Mumbles', t: 'P' }] },
  { n: 36, words: [{ w: 'Show-off', t: 'S' }, { w: 'Stubborn', t: 'C' }, { w: 'Skeptical', t: 'M' }, { w: 'Slow', t: 'P' }] },
  { n: 37, words: [{ w: 'Loud', t: 'S' }, { w: 'Lord over others', t: 'C' }, { w: 'Loner', t: 'M' }, { w: 'Lazy', t: 'P' }] },
  { n: 38, words: [{ w: 'Scatterbrained', t: 'S' }, { w: 'Short-tempered', t: 'C' }, { w: 'Suspicious', t: 'M' }, { w: 'Sluggish', t: 'P' }] },
  { n: 39, words: [{ w: 'Restless', t: 'S' }, { w: 'Rash', t: 'C' }, { w: 'Revengeful', t: 'M' }, { w: 'Reluctant', t: 'P' }] },
  { n: 40, words: [{ w: 'Changeable', t: 'S' }, { w: 'Crafty', t: 'C' }, { w: 'Critical', t: 'M' }, { w: 'Compromising', t: 'P' }] },
]

const TYPE_INFO: Record<TypeKey, { label: string; sub: string; accent: string; bg: string; text: string; bar: string }> = {
  S: { label: 'Sanguine', sub: 'Popular', accent: '#c2410c', bg: 'bg-orange-50', text: 'text-orange-800', bar: 'bg-orange-400' },
  C: { label: 'Choleric', sub: 'Powerful', accent: '#1d4ed8', bg: 'bg-blue-50', text: 'text-blue-800', bar: 'bg-blue-500' },
  M: { label: 'Melancholy', sub: 'Perfect', accent: '#6d28d9', bg: 'bg-violet-50', text: 'text-violet-800', bar: 'bg-violet-500' },
  P: { label: 'Phlegmatic', sub: 'Peaceful', accent: '#065f46', bg: 'bg-emerald-50', text: 'text-emerald-800', bar: 'bg-emerald-500' },
}

const LEADER_INFO: Record<TypeKey, { title: string; summary: string; strengths: string[]; watchFor: string; tags: string[] }> = {
  C: {
    title: 'Choleric — Natural Leader',
    summary: 'Goal-oriented, decisive, and driven. You move fast, delegate well, and inspire others to act. You see the big picture quickly and thrive on challenge.',
    strengths: ['Goal oriented', 'Sees the big picture', 'Organizes well', 'Seeks practical solutions', 'Moves quickly to action', 'Delegates work', 'Insists on production', 'Thrives on opposition'],
    watchFor: 'Watch for: impatience, tactlessness, and a tendency to be bossy or domineering. The best Choleric leaders temper drive with empathy.',
    tags: ['Born leader', 'Dynamic', 'Self-sufficient', 'Decisive'],
  },
  M: {
    title: 'Melancholy — Detail-Driven Leader',
    summary: 'You lead through thoroughness, high standards, and careful planning. You excel in analysis, systems thinking, and creative problem-solving — serious, purposeful, and deeply conscientious.',
    strengths: ['Schedule oriented', 'Detail conscious', 'Persistent and thorough', 'Orderly and organized', 'Finds creative solutions', 'Perfectionist, high standards', 'Needs to finish what they start', 'Likes charts and graphs'],
    watchFor: 'Watch for: getting bogged down in perfectionism, being depressed over imperfections, or being too hard to please. Delegate and accept "good enough" where appropriate.',
    tags: ['Deep and thoughtful', 'Analytical', 'Genius-prone', 'Conscientious'],
  },
  S: {
    title: 'Sanguine — Inspiring Leader',
    summary: 'You lead through energy, enthusiasm, and the ability to motivate others. A natural communicator who builds teams through charm and optimism — people enjoy following you because you make the work fun.',
    strengths: ['Volunteers for jobs', 'Thinks up new activities', 'Has energy and enthusiasm', 'Creative and colorful', 'Inspires others to join', 'Charms others to work'],
    watchFor: 'Watch for: forgetting obligations, lacking follow-through, and being undisciplined. Pair your enthusiasm with strong accountability systems.',
    tags: ['Appealing personality', 'Talkative storyteller', 'Enthusiastic', 'Life of the party'],
  },
  P: {
    title: 'Phlegmatic — Steady Leader',
    summary: 'You lead through consistency, fairness, and calm under pressure. A trusted mediator who builds cohesive teams — competent, agreeable, and with strong administrative ability.',
    strengths: ['Competent and steady', 'Peaceful and agreeable', 'Has administrative ability', 'Mediates problems', 'Avoids conflicts', 'Good under pressure', 'Finds the easy way'],
    watchFor: 'Watch for: lack of self-motivation, resisting being pushed, and dampening enthusiasm. The best Phlegmatic leaders step up to challenge others — and themselves.',
    tags: ['Low-key personality', 'Easygoing and relaxed', 'Patient, well balanced', 'Consistent life'],
  },
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function calcTotals(scores: Scores): Totals {
  return {
    S: scores.S.str + scores.S.wk,
    C: scores.C.str + scores.C.wk,
    M: scores.M.str + scores.M.wk,
    P: scores.P.str + scores.P.wk,
  }
}

function getDominant(totals: Totals): TypeKey {
  return (Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0]) as TypeKey
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0] ?? '').join('').toUpperCase().slice(0, 2)
}

function buildReport(scores: Scores): string {
  const totals = calcTotals(scores)
  const dom = getDominant(totals)
  const L = LEADER_INFO[dom]
  const T = TYPE_INFO[dom]
  return [
    'PERSONALITY PROFILE REPORT',
    'FlaRepublic — Florida Self-Governance',
    '======================================',
    '',
    'SCORES (Grand Total = 40)',
    `  Sanguine  (Popular):   ${totals.S}  [Strengths: ${scores.S.str}, Weaknesses: ${scores.S.wk}]`,
    `  Choleric  (Powerful):  ${totals.C}  [Strengths: ${scores.C.str}, Weaknesses: ${scores.C.wk}]`,
    `  Melancholy (Perfect):  ${totals.M}  [Strengths: ${scores.M.str}, Weaknesses: ${scores.M.wk}]`,
    `  Phlegmatic (Peaceful): ${totals.P}  [Strengths: ${scores.P.str}, Weaknesses: ${scores.P.wk}]`,
    '',
    `DOMINANT TYPE: ${T.label} — ${T.sub}`,
    '',
    `LEADERSHIP PROFILE: ${L.title}`,
    '',
    L.summary,
    '',
    'LEADERSHIP STRENGTHS:',
    ...L.strengths.map(s => `  • ${s}`),
    '',
    `WATCH FOR: ${L.watchFor}`,
    '',
    `KEY TRAITS: ${L.tags.join(', ')}`,
  ].join('\n')
}

// ── Sub-components ───────────────────────────────────────────────────────────

function Tooltip({ text }: { text: string }) {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 hidden group-hover:block w-56 pointer-events-none">
      <div className="bg-popover border border-border rounded-lg px-3 py-2 text-xs text-muted-foreground leading-snug shadow-md">
        {text}
      </div>
      <div className="w-2 h-2 bg-popover border-r border-b border-border rotate-45 mx-auto -mt-1" />
    </div>
  )
}

function WordButton({
  word, type, selected, onSelect,
}: {
  word: string; type: TypeKey; selected: boolean; onSelect: () => void
}) {
  const def = DEFS[word]
  return (
    <div className="relative group">
      <button
        onClick={onSelect}
        className={`w-full px-2 py-2 text-xs rounded-md border transition-all text-center leading-snug font-medium ${
          selected
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background text-foreground border-border hover:border-primary/50 hover:bg-accent'
        }`}
      >
        {word}
      </button>
      {def && <Tooltip text={def} />}
    </div>
  )
}

function ScoreBar({ pct, barClass }: { pct: number; barClass: string }) {
  return (
    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${barClass}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function PersonalityTest() {
  const resultsRef = React.useRef<HTMLDivElement>(null)
  const [tab, setTab] = useState<Tab>('test')
  const [selections, setSelections] = useState<Record<number, TypeKey>>({})
  const [myScores, setMyScores] = useState<Scores | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  // Team form state
  const [memName, setMemName] = useState('')
  const [memS, setMemS] = useState('')
  const [memC, setMemC] = useState('')
  const [memM, setMemM] = useState('')
  const [memP, setMemP] = useState('')

  // Open on results tab if ?tab=results is in the URL (e.g. from member dashboard link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('tab') === 'results') {
      setTab('results')
    }
  }, [])

  const count = Object.keys(selections).length
  const progress = Math.round((count / 40) * 100)

  const pick = useCallback((rowNum: number, type: TypeKey) => {
    setSelections(prev => ({ ...prev, [rowNum]: type }))
  }, [])

  const resetTest = useCallback(() => {
    setSelections({})
  }, [])

  const submitTest = useCallback(async () => {
    if (count < 40) {
      alert(`Please complete all 40 rows first. (${count}/40 done)`)
      return
    }
    const sc: Scores = { S: { str: 0, wk: 0 }, C: { str: 0, wk: 0 }, M: { str: 0, wk: 0 }, P: { str: 0, wk: 0 } }
    Object.entries(selections).forEach(([n, t]) => {
      if (parseInt(n) <= 20) sc[t].str++
      else sc[t].wk++
    })
    setMyScores(sc)
    setTab('results')
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)

    // Save to database if logged in
    try {
      const meRes = await fetch('/api/users/me', { credentials: 'include' })
      const meData = await meRes.json()
      const user = meData?.user
      console.log('me response:', meRes.status, user?.id)
      if (user?.id) {
        const totals = {
          S: sc.S.str + sc.S.wk,
          C: sc.C.str + sc.C.wk,
          M: sc.M.str + sc.M.wk,
          P: sc.P.str + sc.P.wk,
        }
        const dominant = (Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0]) as TypeKey
        const countyId = typeof user.county === 'object' ? user.county?.id : user.county

        const existingRes = await fetch(`/api/personality-results?where[user][equals]=${user.id}&limit=1`, { credentials: 'include' })
        const existingData = await existingRes.json()
        const existing = existingData?.docs?.[0]
        console.log('existing result:', existing?.id ?? 'none')

        const body: Record<string, unknown> = {
          user: user.id,
          sanguine: totals.S,
          choleric: totals.C,
          melancholy: totals.M,
          phlegmatic: totals.P,
          dominantType: dominant,
          completedAt: new Date().toISOString(),
        }
        if (countyId) body.county = countyId

        let saveRes: Response
        if (existing) {
          saveRes = await fetch(`/api/personality-results/${existing.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body),
          })
        } else {
          saveRes = await fetch('/api/personality-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body),
          })
        }
        const saveData = await saveRes.json()
        console.log('save response:', saveRes.status, saveData)
        if (saveRes.ok) setSaved(true)
        else console.error('Save failed:', saveData)
      } else {
        console.log('No user logged in — skipping save')
      }
    } catch (err) {
      console.error('Personality save error:', err)
    }
  }, [count, selections])

  const copyReport = useCallback(async () => {
    if (!myScores) return
    await navigator.clipboard.writeText(buildReport(myScores))
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [myScores])

  const addMeToTeam = useCallback(() => {
    if (!myScores) return
    const totals = calcTotals(myScores)
    setTeamMembers(prev => {
      const filtered = prev.filter(m => m.name !== 'Me')
      return [...filtered, { name: 'Me', scores: totals }]
    })
    setTab('team')
  }, [myScores])

  const addMember = useCallback(() => {
    if (!memName.trim()) { alert('Please enter a name.'); return }
    setTeamMembers(prev => [...prev, {
      name: memName.trim(),
      scores: { S: parseInt(memS) || 0, C: parseInt(memC) || 0, M: parseInt(memM) || 0, P: parseInt(memP) || 0 },
    }])
    setMemName(''); setMemS(''); setMemC(''); setMemM(''); setMemP('')
  }, [memName, memS, memC, memM, memP])

  const removeMember = useCallback((i: number) => {
    setTeamMembers(prev => prev.filter((_, idx) => idx !== i))
  }, [])

  // ── Render: Test tab ────────────────────────────────────────────────────

  const renderTestTab = () => (
    <div>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{count} of 40 selected</span>
          <span className="text-sm font-medium text-foreground">{progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Type legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {(['S', 'C', 'M', 'P'] as TypeKey[]).map(t => {
          const info = TYPE_INFO[t]
          return (
            <div key={t} className={`rounded-lg px-3 py-2 text-center ${info.bg}`}>
              <p className={`text-xs font-semibold ${info.text}`}>{info.label}</p>
              <p className={`text-xs ${info.text} opacity-70`}>{info.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Strengths */}
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Strengths — rows 1 to 20</h3>
      <div className="space-y-1.5 mb-8">
        {ROWS.slice(0, 20).map(row => (
          <div key={row.n} className="grid grid-cols-[28px_1fr_1fr_1fr_1fr] gap-1.5 items-start">
            <span className="text-xs text-muted-foreground text-right pt-2.5">{row.n}</span>
            {row.words.map(({ w, t }) => (
              <WordButton key={w} word={w} type={t} selected={selections[row.n] === t} onSelect={() => pick(row.n, t)} />
            ))}
          </div>
        ))}
      </div>

      {/* Weaknesses */}
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Weaknesses — rows 21 to 40</h3>
      <div className="space-y-1.5 mb-8">
        {ROWS.slice(20).map(row => (
          <div key={row.n} className="grid grid-cols-[28px_1fr_1fr_1fr_1fr] gap-1.5 items-start">
            <span className="text-xs text-muted-foreground text-right pt-2.5">{row.n}</span>
            {row.words.map(({ w, t }) => (
              <WordButton key={w} word={w} type={t} selected={selections[row.n] === t} onSelect={() => pick(row.n, t)} />
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <button onClick={submitTest} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <BarChart3 className="h-4 w-4" /> See my results
        </button>
        <button onClick={resetTest} className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>
    </div>
  )

  // ── Render: Results tab ─────────────────────────────────────────────────

  const renderResultsTab = () => {
    if (!myScores) {
      return (
        <div className="text-center py-16 text-muted-foreground">
          <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Complete the test to see your results.</p>
          <button onClick={() => setTab('test')} className="mt-4 text-sm text-primary hover:underline">Go to test</button>
        </div>
      )
    }

    const totals = calcTotals(myScores)
    const max = Math.max(...Object.values(totals))
    const dom = getDominant(totals)
    const L = LEADER_INFO[dom]
    const domInfo = TYPE_INFO[dom]

    return (
      <div ref={resultsRef}>
        {/* Score cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {(['S', 'C', 'M', 'P'] as TypeKey[]).map(t => {
            const info = TYPE_INFO[t]
            const tot = totals[t]
            const pct = Math.round((tot / 40) * 100)
            const isDom = tot === max
            return (
              <div key={t} className={`rounded-xl border p-4 transition-all ${isDom ? 'border-primary/40 bg-primary/5' : 'border-border bg-background'}`}>
                <p className="text-xs text-muted-foreground">{info.sub}</p>
                <p className="text-sm font-semibold text-foreground mb-1">{info.label}</p>
                <p className="text-3xl font-bold text-foreground">{tot}</p>
                <p className="text-xs text-muted-foreground mb-2">{myScores[t].str} str · {myScores[t].wk} wk</p>
                <ScoreBar pct={pct} barClass={info.bar} />
              </div>
            )
          })}
        </div>

        {/* Leader profile */}
        <div className={`rounded-xl border-2 p-6 mb-6 ${domInfo.bg}`} style={{ borderColor: domInfo.accent + '40' }}>
          <h2 className="text-xl font-bold text-foreground mb-2">{L.title}</h2>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {L.tags.map(tag => (
              <span key={tag} className={`text-xs font-medium px-2.5 py-1 rounded-full ${domInfo.bg} ${domInfo.text} border border-current/20`}>{tag}</span>
            ))}
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed mb-5">{L.summary}</p>

          <h3 className="text-sm font-semibold text-foreground mb-2">Leadership strengths</h3>
          <div className="grid grid-cols-2 gap-1.5 mb-5">
            {L.strengths.slice(0, 6).map(s => (
              <div key={s} className="text-xs bg-background/60 border border-border/50 rounded-lg px-3 py-2 text-foreground/80">{s}</div>
            ))}
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-xs text-amber-800 leading-relaxed">{L.watchFor}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap items-center">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 font-medium">
              <Check className="h-4 w-4" /> Results saved to your profile
            </span>
          )}
          <button onClick={copyReport} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors">
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy report'}
          </button>
          <button onClick={addMeToTeam} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors">
            <UserPlus className="h-4 w-4" /> Add me to team
          </button>
          <button onClick={() => setTab('test')} className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <RotateCcw className="h-4 w-4" /> Retake
          </button>
        </div>

        {/* Personality Guide — full reference material from pages 3 & 5 */}
        <PersonalityGuide dominant={dom} />
      </div>
    )
  }

  // ── Render: Team tab ────────────────────────────────────────────────────

  const renderTeamTab = () => {
    const teamTotals = { S: 0, C: 0, M: 0, P: 0 } as Totals
    const typeCounts = { S: 0, C: 0, M: 0, P: 0 } as Totals
    teamMembers.forEach(m => {
      ;(['S', 'C', 'M', 'P'] as TypeKey[]).forEach(t => { teamTotals[t] += m.scores[t] })
      const dom = getDominant(m.scores)
      typeCounts[dom]++
    })
    const grand = Object.values(teamTotals).reduce((a, b) => a + b, 0) || 1
    const teamDom = getDominant(teamTotals)
    const missingTypes = (['S', 'C', 'M', 'P'] as TypeKey[]).filter(t => typeCounts[t] === 0).map(t => TYPE_INFO[t].label)

    return (
      <div>
        {/* Add member form */}
        <div className="rounded-xl border border-border bg-muted/30 p-5 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Add a team member</h3>
          <input
            type="text"
            placeholder="Name"
            value={memName}
            onChange={e => setMemName(e.target.value)}
            className="w-full mb-3 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { label: 'Sanguine', val: memS, set: setMemS },
              { label: 'Choleric', val: memC, set: setMemC },
              { label: 'Melancholy', val: memM, set: setMemM },
              { label: 'Phlegmatic', val: memP, set: setMemP },
            ].map(({ label, val, set }) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                <input
                  type="number"
                  min={0}
                  max={20}
                  placeholder="0"
                  value={val}
                  onChange={e => set(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-2 py-2 text-sm text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            ))}
          </div>
          <button onClick={addMember} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <UserPlus className="h-4 w-4" /> Add member
          </button>
        </div>

        {/* Team list */}
        {teamMembers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No team members yet. Add yourself or enter scores for teammates.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {teamMembers.map((m, i) => {
                const dom = getDominant(m.scores)
                const info = TYPE_INFO[dom]
                const tot = Object.values(m.scores).reduce((a, b) => a + b, 0) || 1
                return (
                  <div key={i} className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${info.bg} ${info.text}`}>
                        {getInitials(m.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{info.label} — {info.sub}</p>
                      </div>
                      <button onClick={() => removeMember(i)} className="text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded hover:bg-destructive/10">
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {(['S', 'C', 'M', 'P'] as TypeKey[]).map(t => (
                        <div key={t}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">{TYPE_INFO[t].label.slice(0, 3)}</span>
                            <span className="text-xs font-medium text-foreground">{m.scores[t]}</span>
                          </div>
                          <div className="h-1 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${TYPE_INFO[t].bar}`} style={{ width: `${Math.round((m.scores[t] / tot) * 100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Team summary */}
            <div className="rounded-xl border border-border bg-background p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Team profile — {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}</h3>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {(['S', 'C', 'M', 'P'] as TypeKey[]).map(t => (
                  <div key={t} className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">{TYPE_INFO[t].label}</p>
                    <p className="text-xl font-bold text-foreground">{Math.round((teamTotals[t] / grand) * 100)}%</p>
                    <p className="text-xs text-muted-foreground">{typeCounts[t]} dominant</p>
                  </div>
                ))}
              </div>
              {/* Stacked bar */}
              <div className="flex h-2.5 rounded-full overflow-hidden mb-4">
                {(['S', 'C', 'M', 'P'] as TypeKey[]).map(t => (
                  <div key={t} className={`${TYPE_INFO[t].bar} transition-all duration-700`} style={{ flex: teamTotals[t] || 0 }} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Team leans <span className="font-medium text-foreground">{TYPE_INFO[teamDom].label}</span>.{' '}
                {missingTypes.length > 0
                  ? <span className="text-amber-700">No dominant {missingTypes.join(' or ')} — consider recruiting for {missingTypes.length > 1 ? 'these traits' : 'this trait'}.</span>
                  : <span className="text-emerald-700">Good balance across all four types.</span>
                }
              </p>
            </div>
          </>
        )}
      </div>
    )
  }

  // ── Main render ─────────────────────────────────────────────────────────

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'test', label: 'Take the test', icon: <ClipboardList className="h-4 w-4" /> },
    { id: 'results', label: 'My results', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'team', label: 'Team comparison', icon: <Users className="h-4 w-4" /> },
  ]

  return (
    <div className="w-full">
      {/* Tab bar */}
      <div className="flex border-b border-border mb-8 gap-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'test' && renderTestTab()}
      {tab === 'results' && renderResultsTab()}
      {tab === 'team' && renderTeamTab()}
    </div>
  )
}
