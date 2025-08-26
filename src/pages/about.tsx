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
              A small team curating free learning resources into structured paths for self-directed career development
            </p>
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro"
              style={{marginTop: '1rem'}}>
              Explore Learning Paths
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
    { label: 'Who we are', active: true },
    { label: 'Our story', active: false }
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

function WhoWeAre() {
  return (
    <section className="padding-vert--xl">
      <div className="container">
        <div className="row">
          <div className="col col--7">
            <Heading as="h2" style={{color: 'var(--ifm-color-primary)', fontSize: '2.5rem', marginBottom: '2rem'}}>
              Who we are
            </Heading>
            
            <div style={{marginBottom: '2rem'}}>
              <p style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                We're a small team of engineers who believe that <strong style={{color: 'var(--ifm-color-primary)'}}>quality education should be accessible to everyone</strong>. 
                We don't create courses or content—instead, we spend our time finding and organizing the best free learning resources already available on the internet.
              </p>
            </div>

            <div style={{marginBottom: '2rem'}}>
              <p style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                Our mission is simple: <strong style={{color: 'var(--ifm-color-primary)'}}>curate freely available resources into structured learning paths</strong> that help 
                people teach themselves the skills they need to transition into tech careers or advance in their current roles.
              </p>
            </div>

            <div style={{marginBottom: '2rem'}}>
              <p style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1rem'}}>
                We focus on <strong style={{color: 'var(--ifm-color-primary)'}}>self-directed learning</strong>—providing clear pathways through the overwhelming amount of 
                information available online, so learners can focus on studying rather than searching.
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
                "We believe the best learning resources are already out there—they just need to be organized in a way that makes sense for career development."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OurStory() {
  return (
    <section className="padding-vert--xl" style={{background: 'var(--ifm-background-surface-color)'}}>
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <Heading as="h2" style={{color: 'var(--ifm-color-primary)', fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center'}}>
              Our story
            </Heading>
            <div style={{fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem'}}>
              <p style={{marginBottom: '2rem'}}>
                Like many people, we found ourselves overwhelmed by the sheer amount of learning resources available online. 
                YouTube tutorials, blog posts, documentation, free courses—there's incredible content out there, but it's scattered 
                and hard to navigate when you're trying to learn systematically.
              </p>
              <p style={{marginBottom: '2rem'}}>
                We started Chasing Cloud Careers because we experienced firsthand how challenging it can be to piece together 
                a coherent learning path from all the free resources available. We wanted to solve this problem not just for 
                ourselves, but for anyone looking to break into tech or advance their engineering skills.
              </p>
              <p style={{marginBottom: '2rem'}}>
                Our approach is simple: we research, test, and organize the best free educational content into logical sequences 
                that take you from beginner to job-ready. We don't reinvent the wheel—we just make it easier to find and follow 
                the path that's right for you.
              </p>
              <p style={{marginBottom: '3rem', color: 'var(--ifm-color-content-secondary)'}}>
                Every learning path we create is built from resources that are completely free and publicly available. 
                We believe that with the right guidance and structure, anyone can teach themselves the skills they need to succeed in tech.
              </p>
            </div>
            <div className="text--center">
              <Link
                className="button button--primary button--lg"
                to="/docs/intro"
                style={{marginTop: '1rem'}}>
                Explore Our Learning Paths
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
      description="Learn about Chasing Cloud Careers - a small team curating free learning resources into structured paths for self-directed career development.">
      <AboutHero />
      <NavigationTabs />
      <main>
        <WhoWeAre />
        <OurStory />
      </main>
    </Layout>
  );
}
