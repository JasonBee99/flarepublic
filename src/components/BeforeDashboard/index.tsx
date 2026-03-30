import React from 'react'

const BeforeDashboard: React.FC = () => {
  return (
    <div style={{
      marginBottom: '2rem',
      padding: '1.25rem 1.5rem',
      background: 'var(--theme-elevation-50)',
      borderRadius: '0.5rem',
      border: '1px solid var(--theme-elevation-150)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap',
    }}>
      <div>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>FlaRepublic Admin</p>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', opacity: 0.7 }}>
          Manage users, counties, forum, learning content, and focus groups.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1rem',
            background: 'var(--theme-success-500)',
            color: '#fff',
            borderRadius: '0.375rem',
            fontWeight: 600,
            fontSize: '0.85rem',
            textDecoration: 'none',
          }}
        >
          ↗ View Site
        </a>
        <a
          href="/member"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1rem',
            background: 'var(--theme-elevation-150)',
            color: 'var(--theme-text)',
            borderRadius: '0.375rem',
            fontWeight: 600,
            fontSize: '0.85rem',
            textDecoration: 'none',
          }}
        >
          My Area
        </a>
        <a
          href="/county-dashboards"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1rem',
            background: 'var(--theme-elevation-150)',
            color: 'var(--theme-text)',
            borderRadius: '0.375rem',
            fontWeight: 600,
            fontSize: '0.85rem',
            textDecoration: 'none',
          }}
        >
          County Dashboards
        </a>
      </div>
    </div>
  )
}

export default BeforeDashboard
