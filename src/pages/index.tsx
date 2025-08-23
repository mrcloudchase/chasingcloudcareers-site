import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className="text--center">
              <Heading as="h1" className="hero__title">
                Launch Your Engineering Career
              </Heading>
              <p className="hero__subtitle">
                Free, comprehensive learning paths for Support, Linux, Cloud, DevOps, and AI Engineering. 
                Get job-ready with hands-on projects and industry best practices.
              </p>
              <div className={styles.buttons}>
                <Link
                  className="button button--secondary button--lg margin-right--md"
                  to="/docs/intro">
                  🚀 Start Learning
                </Link>
                <Link
                  className="button button--outline button--secondary button--lg"
                  to="/docs/intro">
                  📚 Browse Paths
                </Link>
              </div>
              
              {/* Stats Section */}
              <div className="margin-top--xl">
                <div className="row">
                  <div className="col col--4">
                    <div className="text--center">
                      <div style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>5</div>
                      <div style={{opacity: 0.8}}>Learning Paths</div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="text--center">
                      <div style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>100%</div>
                      <div style={{opacity: 0.8}}>Free Resources</div>
                    </div>
                  </div>
                  <div className="col col--4">
                    <div className="text--center">
                      <div style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>∞</div>
                      <div style={{opacity: 0.8}}>Career Growth</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated Background Elements */}
      <div className={styles.heroBackground}>
        <div className={styles.floatingElement} style={{top: '10%', left: '10%', animationDelay: '0s'}}>💻</div>
        <div className={styles.floatingElement} style={{top: '20%', right: '15%', animationDelay: '1s'}}>☁️</div>
        <div className={styles.floatingElement} style={{bottom: '30%', left: '20%', animationDelay: '2s'}}>🚀</div>
        <div className={styles.floatingElement} style={{bottom: '20%', right: '10%', animationDelay: '3s'}}>⚡</div>
        <div className={styles.floatingElement} style={{top: '50%', left: '5%', animationDelay: '4s'}}>🔧</div>
        <div className={styles.floatingElement} style={{top: '60%', right: '5%', animationDelay: '5s'}}>🤖</div>
      </div>
    </header>
  );
}

function TechStackSection() {
  const techStacks = [
    { name: 'AWS', icon: '☁️' },
    { name: 'Docker', icon: '🐳' },
    { name: 'Kubernetes', icon: '⚙️' },
    { name: 'Python', icon: '🐍' },
    { name: 'Linux', icon: '🐧' },
    { name: 'Git', icon: '📝' },
    { name: 'Terraform', icon: '🏗️' },
    { name: 'Jenkins', icon: '🔄' },
  ];

  return (
    <section className="padding-vert--xl" style={{background: 'var(--ifm-background-surface-color)'}}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h2" className="text-gradient">
            🛠️ Technologies You'll Master
          </Heading>
          <p>Industry-standard tools and technologies used by top companies</p>
        </div>
        <div className="row">
          {techStacks.map((tech, idx) => (
            <div key={idx} className="col col--3 margin-bottom--md">
              <div className="text--center padding--md" style={{
                background: 'var(--gradient-subtle)',
                borderRadius: 'var(--ifm-border-radius)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>{tech.icon}</div>
                <div style={{fontWeight: '600'}}>{tech.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="padding-vert--xl bg-gradient">
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className="text--center" style={{color: 'white'}}>
              <Heading as="h2" style={{color: 'white', marginBottom: '1rem'}}>
                Ready to Transform Your Career?
              </Heading>
              <p style={{fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9}}>
                Join thousands of engineers who have successfully transitioned into tech careers 
                using our proven learning paths.
              </p>
              <Link
                className="button button--secondary button--lg"
                to="/docs/intro">
                🎯 Choose Your Path
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Free Engineering Career Learning Paths"
      description="Master Support, Linux, Cloud, DevOps, and AI Engineering with our comprehensive, free learning paths. Get job-ready with hands-on projects and industry best practices.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <TechStackSection />
        <CTASection />
      </main>
    </Layout>
  );
}