import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function AboutHero() {
  return (
    <header className={clsx('hero', styles.heroBanner)} style={{minHeight: '60vh'}}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col col--6">
            <Heading as="h1" className="hero__title" style={{textAlign: 'left', marginBottom: '2rem'}}>
              Who we are
            </Heading>
            <p className="hero__subtitle" style={{textAlign: 'left', fontSize: '1.2rem', marginBottom: '2rem'}}>
              The catalyst for accelerating career success through the delivery of curated learning paths
            </p>
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro"
              style={{marginTop: '1rem'}}>
              Our commitment to you
            </Link>
          </div>
          <div className="col col--6">
            <div style={{
              position: 'relative',
              height: '400px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8rem',
              opacity: 0.3
            }}>
              👥
            </div>
          </div>
        </div>
      </div>
      <div className={styles.heroBackground}></div>
    </header>
  );
}

function NavigationTabs() {
  const tabs = [
    { label: 'About Us', active: true },
    { label: 'Our history', active: false },
    { label: 'Our focus', active: false },
    { label: 'Core values', active: false },
    { label: 'Our leadership', active: false },
    { label: 'Our approach', active: false }
  ];

  return (
    <section style={{background: 'var(--ifm-background-surface-color)', borderBottom: '1px solid rgba(99, 102, 241, 0.1)'}}>
      <div className="container">
        <div className="row">
          <div className="col">
            <div style={{
              display: 'flex',
              gap: '2rem',
              padding: '1rem 0',
              borderBottom: '3px solid var(--ifm-color-primary)',
              overflowX: 'auto'
            }}>
              {tabs.map((tab, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.5rem 0',
                    color: tab.active ? 'var(--ifm-color-primary)' : 'var(--ifm-color-content-secondary)',
                    fontWeight: tab.active ? '600' : '400',
                    borderBottom: tab.active ? '2px solid var(--ifm-color-primary)' : 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatMakesUsUnique() {
  return (
    <section className="padding-vert--xl">
      <div className="container">
        <div className="row">
          <div className="col col--7">
            <Heading as="h2" style={{color: 'var(--ifm-color-primary)', fontSize: '2.5rem', marginBottom: '2rem'}}>
              What makes us unique
            </Heading>
            
            <div style={{marginBottom: '2rem'}}>
              <p style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                Our comprehensive <strong style={{color: 'var(--ifm-color-primary)'}}>expertise and global footprint</strong> means we 
                can serve aspiring engineers in any industry regardless of their location.
              </p>
            </div>

            <div style={{marginBottom: '2rem'}}>
              <p style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                Chasing Cloud Careers is a <strong style={{color: 'var(--ifm-color-primary)'}}>visionary, flexible, and nimble service provider</strong>, forging 
                strategic partnerships with organizations to solve their unique talent development challenges.
              </p>
            </div>

            <div style={{marginBottom: '2rem'}}>
              <p style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                We build <strong style={{color: 'var(--ifm-color-primary)'}}>vendor-agnostic solutions</strong> that are tailored to our 
                learners' career priorities and growth objectives.
              </p>
            </div>
          </div>
          
          <div className="col col--5">
            <div style={{
              background: 'var(--gradient-subtle)',
              borderRadius: 'var(--ifm-card-border-radius)',
              padding: '2rem',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              height: 'fit-content'
            }}>
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                fontStyle: 'italic',
                color: 'var(--ifm-color-content-secondary)',
                margin: 0
              }}>
                "The value we bring to the learners is the quality of our curation and the experience that we have 
                organizationally in the engineering and technology world."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TransformationSection() {
  return (
    <section className="padding-vert--xl" style={{background: 'var(--ifm-background-surface-color)'}}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2" style={{color: 'var(--ifm-color-primary)', fontSize: '2.5rem', marginBottom: '2rem'}}>
            Career transformation in the global landscape
          </Heading>
          <div className="row">
            <div className="col col--8 col--offset-2">
              <p style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem'}}>
                Today, all professionals—regardless of experience—exist in a highly globalized world. Whether your 
                challenge is developing a cloud strategy, assessing security vulnerabilities, or developing an 
                interactive experience for your customers, you need a partner with a global perspective that 
                understands your strategic goals.
              </p>
              <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem', color: 'var(--ifm-color-content-secondary)'}}>
                From consulting to design and implementation to ongoing maintenance and optimization, Chasing Cloud Careers combines deep technology 
                experience with the expertise of professionals who bring a personal approach to career transformation.
              </p>
              <Link
                className="button button--primary button--lg"
                to="/docs/intro"
                style={{marginTop: '1rem'}}>
                A Global Learning Provider
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultsSection() {
  return (
    <section className="padding-vert--xl">
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <Heading as="h2" style={{color: 'var(--ifm-color-primary)', fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center'}}>
              It's not about courses. It's about results.
            </Heading>
            <p style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem', textAlign: 'center'}}>
              From strategy through execution, Chasing Cloud Careers delivers comprehensive career results for your transformative learning initiatives.
            </p>
            <p style={{fontSize: '1rem', lineHeight: '1.6', marginBottom: '3rem', color: 'var(--ifm-color-content-secondary)'}}>
              Our learners achieve their objectives through strategic development and modernization of skills and their deployment on secure, scalable platforms. 
              With continuous monitoring, management, and optimization, organizations free their talent to focus on innovation needed to thrive in the 
              application era.
            </p>
            <div className="text--center">
              <Link
                className="button button--primary button--lg"
                href="https://discord.gg/your-discord-invite"
                target="_blank"
                rel="noopener noreferrer">
                Speak to an Expert
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



export default function About(): JSX.Element {
  return (
    <Layout
      title="About Us"
      description="Learn about Chasing Cloud Careers, our mission to democratize engineering education, and meet our founders Chase Dovey and Emma Schwarz.">
      <AboutHero />
      <NavigationTabs />
      <main>
        <WhatMakesUsUnique />
        <TransformationSection />
        <ResultsSection />
      </main>
    </Layout>
  );
}
