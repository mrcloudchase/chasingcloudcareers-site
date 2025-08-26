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
        <div className="text--center">
          <Heading as="h1" className="hero__title" style={{marginBottom: '2rem'}}>
            About Chasing Cloud Careers
          </Heading>
          <p className="hero__subtitle" style={{fontSize: '1.3rem', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem'}}>
            We're two self-taught engineers who transitioned into tech from non-traditional backgrounds. 
            Now we help others do the same by curating the best free learning resources into structured paths.
          </p>
          <div style={{display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link
              className="button button--primary button--lg"
              to="/docs/intro">
              Explore Learning Paths
            </Link>
            <Link
              className="button button--secondary button--lg"
              href="https://discord.gg/your-discord-invite"
              target="_blank"
              rel="noopener noreferrer">
              Join Our Community
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.heroBackground}></div>
    </header>
  );
}

function WhoWeAreSection() {
  const founders = [
    {
      name: 'Chase Dovey',
      role: 'Co-Founder',
      image: '/img/chase-dovey.jpg', // Placeholder - you'll need to add actual images
      quote: 'Self-teaching changed my life. I went from non-tech to cloud engineering, and I want to help others find that same path through curated, accessible resources.',
      background: 'Transitioned from [previous background] to cloud engineering through self-directed learning'
    },
    {
      name: 'Emma Schwarz',
      role: 'Co-Founder',
      image: '/img/emma-schwarz.jpg', // Placeholder - you'll need to add actual images
      quote: 'The best learning resources are already out there for free—we just organize them so you can focus on learning instead of searching.',
      background: 'Self-taught path from [previous background] to AI/ML engineering and community building'
    }
  ];

  return (
    <section className="padding-vert--xl">
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2" style={{color: 'var(--ifm-color-primary)', fontSize: '2.5rem', marginBottom: '1rem'}}>
            Who We Are
          </Heading>
          <p style={{fontSize: '1.2rem', color: 'var(--ifm-color-content-secondary)', maxWidth: '600px', margin: '0 auto'}}>
            Meet the founders who are passionate about making tech education accessible through self-directed learning
          </p>
        </div>
        
        <div className="row">
          {founders.map((founder, idx) => (
            <div key={idx} className="col col--6 margin-bottom--lg">
              <div style={{
                background: 'var(--gradient-subtle)',
                borderRadius: 'var(--ifm-card-border-radius)',
                padding: '2.5rem',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                height: '100%',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}>
                {/* Profile Image Placeholder */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  margin: '0 auto 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  color: 'white'
                }}>
                  {founder.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <Heading as="h3" style={{marginBottom: '0.5rem'}}>
                  {founder.name}
                </Heading>
                <p style={{color: 'var(--ifm-color-primary)', fontWeight: '600', marginBottom: '1.5rem'}}>
                  {founder.role}
                </p>
                
                <blockquote style={{
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  color: 'var(--ifm-color-content)',
                  margin: '0 0 1.5rem 0',
                  padding: '0',
                  border: 'none',
                  lineHeight: '1.6'
                }}>
                  "{founder.quote}"
                </blockquote>
                
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--ifm-color-content-secondary)',
                  margin: 0
                }}>
                  {founder.background}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OurStorySection() {
  return (
    <section className="padding-vert--xl" style={{background: 'var(--ifm-background-surface-color)'}}>
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className="text--center margin-bottom--xl">
              <Heading as="h2" style={{color: 'var(--ifm-color-primary)', fontSize: '2.5rem', marginBottom: '1rem'}}>
                Our Story
              </Heading>
              <p style={{fontSize: '1.2rem', color: 'var(--ifm-color-content-secondary)'}}>
                From self-taught beginnings to helping others find their path in tech
              </p>
            </div>
            
            <div style={{fontSize: '1.1rem', lineHeight: '1.7', textAlign: 'center'}}>
              <p style={{marginBottom: '1.5rem'}}>
                We both came to tech through unconventional paths. Without computer science degrees, we taught ourselves 
                the skills needed to transition into engineering roles. The journey wasn't easy—we spent countless hours 
                searching through scattered resources, trying to piece together coherent learning paths.
              </p>
              <p style={{marginBottom: '2rem'}}>
                Our self-taught journeys taught us that the resources are out there—they just need to be organized in a way that 
                makes sense for career development. That's exactly what we set out to do.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OurMissionSection() {
  return (
    <section className="padding-vert--xl">
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div style={{
              background: 'var(--gradient-subtle)',
              borderRadius: 'var(--ifm-card-border-radius)',
              padding: '3rem',
              border: '1px solid rgba(99, 102, 241, 0.1)',
              textAlign: 'center'
            }}>
              <Heading as="h2" style={{color: 'var(--ifm-color-primary)', fontSize: '2.5rem', marginBottom: '1.5rem'}}>
                Our Mission
              </Heading>
              <p style={{fontSize: '1.3rem', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                <strong>Help others self-teach by providing curated, structured learning paths using completely free resources.</strong>
              </p>
              <p style={{fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--ifm-color-content-secondary)', marginBottom: '2rem'}}>
                We believe that quality tech education should be accessible to everyone. By organizing the best free resources 
                into clear learning paths, we're removing barriers that prevent people from successfully transitioning into tech careers.
              </p>
              
              <div className="text--center">
                <Link
                  className="button button--primary button--lg margin-right--md"
                  to="/docs/intro">
                  Start Your Learning Journey
                </Link>
                <Link
                  className="button button--secondary button--lg"
                  href="https://discord.gg/your-discord-invite"
                  target="_blank"
                  rel="noopener noreferrer">
                  Join Our Community
                </Link>
              </div>
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
      description="Meet Chase Dovey and Emma Schwarz - two self-taught engineers helping others transition into tech through curated free learning resources.">
      <AboutHero />
      <main>
        <WhoWeAreSection />
        <OurStorySection />
        <OurMissionSection />
      </main>
    </Layout>
  );
}
