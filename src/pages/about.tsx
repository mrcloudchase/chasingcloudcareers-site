import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function AboutHeader() {
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className="text--center">
              <Heading as="h1" className="hero__title">
                About Chasing Cloud Careers
              </Heading>
              <p className="hero__subtitle">
                Democratizing access to engineering education through curated learning paths
              </p>
              
              {/* Stats Section */}
              <div className="margin-top--xl">
                <div className="row">
                  <div className="col col--4">
                    <div className="text--center">
                      <div style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>6</div>
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
      </div>
    </header>
  );
}

function MissionSection() {
  return (
    <section className="padding-vert--xl">
      <div className="container">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className="text--center margin-bottom--lg">
              <Heading as="h2" className="text-gradient">
                Our Mission
              </Heading>
              <p className="text--large">
                We believe that quality engineering education should be accessible to everyone, regardless of 
                their financial situation or background. By curating the best free resources available online 
                and organizing them into structured learning paths, we're removing barriers to entry in the 
                tech industry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatWeDoSection() {
  const features = [
    {
      title: 'Curate Quality Content',
      description: 'We carefully vet and select the best free educational resources from across the internet.',
      icon: '🎯'
    },
    {
      title: 'Structure Learning Paths',
      description: 'Organize content into logical, progressive sequences that take you from beginner to job-ready.',
      icon: '📚'
    },
    {
      title: 'Build Community',
      description: 'Foster a supportive environment where learners can connect, share progress, and help each other.',
      icon: '🤝'
    }
  ];

  return (
    <section className="padding-vert--xl" style={{background: 'var(--ifm-background-surface-color)'}}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h2" className="text-gradient">
            What We Do
          </Heading>
          <p className="text--large">
            We don't create courses or content. Instead, we carefully curate existing free resources 
            and organize them into structured learning paths for six engineering disciplines.
          </p>
        </div>
        <div className="row">
          {features.map((feature, idx) => (
            <div key={idx} className="col col--4 margin-bottom--lg">
              <div className="text--center padding--lg" style={{
                background: 'var(--gradient-subtle)',
                borderRadius: 'var(--ifm-card-border-radius)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                height: '100%',
                transition: 'all 0.3s ease'
              }}>
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>{feature.icon}</div>
                <Heading as="h3" style={{color: 'var(--ifm-color-primary)', marginBottom: '1rem'}}>
                  {feature.title}
                </Heading>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FoundersSection() {
  const founders = [
    {
      name: 'Chase Dovey',
      role: 'Co-Founder & Lead Curator',
      description: 'Chase brings extensive experience in cloud engineering and technical education. Passionate about making complex technologies accessible, Chase focuses on curating our cloud and infrastructure learning paths.',
      specialties: 'Cloud Architecture, DevOps, Infrastructure',
      avatar: '👨‍💻'
    },
    {
      name: 'Emma Schwarz',
      role: 'Co-Founder & Community Lead',
      description: 'Emma leads our community initiatives and ensures our learning paths meet real-world industry needs. With a background in engineering education, Emma is dedicated to creating inclusive learning environments.',
      specialties: 'Community Building, Education, AI/ML',
      avatar: '👩‍💻'
    }
  ];

  return (
    <section className="padding-vert--xl">
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h2" className="text-gradient">
            Meet Our Founders
          </Heading>
          <p className="text--large">
            The passionate individuals behind Chasing Cloud Careers
          </p>
        </div>
        <div className="row">
          {founders.map((founder, idx) => (
            <div key={idx} className="col col--6 margin-bottom--lg">
              <div className="card" style={{height: '100%'}}>
                <div className="card__header text--center">
                  <div style={{fontSize: '4rem', marginBottom: '1rem'}}>{founder.avatar}</div>
                  <Heading as="h3">{founder.name}</Heading>
                  <p style={{color: 'var(--ifm-color-primary)', fontWeight: '600', fontStyle: 'italic'}}>
                    {founder.role}
                  </p>
                </div>
                <div className="card__body">
                  <p>{founder.description}</p>
                  <div className="margin-top--md">
                    <p><strong>Specialties:</strong> {founder.specialties}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LearningPathsSection() {
  const paths = [
    { name: 'Support Engineering', icon: '🎧', description: 'Technical support and customer success' },
    { name: 'Linux Engineering', icon: '🐧', description: 'Systems administration and server management' },
    { name: 'Cloud Engineering', icon: '☁️', description: 'AWS, Azure, GCP, and cloud-native technologies' },
    { name: 'DevOps Engineering', icon: '⚙️', description: 'CI/CD, containerization, and automation' },
    { name: 'AI Engineering', icon: '🤖', description: 'MLOps, model deployment, and AI infrastructure' },
    { name: 'Research Engineering', icon: '🔬', description: 'Cutting-edge research and development' }
  ];

  return (
    <section className="padding-vert--xl" style={{background: 'var(--ifm-background-surface-color)'}}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h2" className="text-gradient">
            Our Learning Paths
          </Heading>
          <p className="text--large">
            Six comprehensive learning paths designed for career development
          </p>
        </div>
        <div className="row">
          {paths.map((path, idx) => (
            <div key={idx} className="col col--4 margin-bottom--md">
              <div className="text--center padding--md" style={{
                background: 'var(--gradient-subtle)',
                borderRadius: 'var(--ifm-border-radius)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                transition: 'all 0.2s ease',
                height: '100%'
              }}>
                <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>{path.icon}</div>
                <div style={{fontWeight: '600', marginBottom: '0.5rem', color: 'var(--ifm-color-primary)'}}>
                  {path.name}
                </div>
                <div style={{fontSize: '0.9rem', opacity: 0.8}}>{path.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const values = [
    {
      title: 'Accessibility First',
      description: 'Education should be free and available to everyone, regardless of economic background.',
      icon: '🌟'
    },
    {
      title: 'Quality Over Quantity',
      description: 'We carefully vet every resource to ensure it meets our high standards for clarity and usefulness.',
      icon: '🏆'
    },
    {
      title: 'Community-Driven',
      description: 'Our learning paths evolve based on feedback from real learners and industry professionals.',
      icon: '🤝'
    },
    {
      title: 'Transparency',
      description: 'We\'re open about our curation process and welcome community contributions to improve our paths.',
      icon: '🔍'
    }
  ];

  return (
    <section className="padding-vert--xl">
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h2" className="text-gradient">
            Our Values
          </Heading>
          <p className="text--large">
            The principles that guide everything we do
          </p>
        </div>
        <div className="row">
          {values.map((value, idx) => (
            <div key={idx} className="col col--6 margin-bottom--lg">
              <div className="text--center">
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>{value.icon}</div>
                <Heading as="h3" style={{color: 'var(--ifm-color-primary)', marginBottom: '1rem'}}>
                  {value.title}
                </Heading>
                <p>{value.description}</p>
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
                Ready to Start Your Learning Journey?
              </Heading>
              <p style={{fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9}}>
                Join our community and explore our curated learning paths. 
                Everything is completely free and designed to help you succeed.
              </p>
              <div className={styles.buttons}>
                <Link
                  className="button button--secondary button--lg margin-right--md"
                  to="/docs/intro">
                  Explore Learning Paths
                </Link>
                <Link
                  className="button button--primary button--lg"
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
      description="Learn about Chasing Cloud Careers, our mission to democratize engineering education, and meet our founders Chase Dovey and Emma Schwarz.">
      <AboutHeader />
      <main>
        <MissionSection />
        <WhatWeDoSection />
        <FoundersSection />
        <LearningPathsSection />
        <ValuesSection />
        <CTASection />
      </main>
    </Layout>
  );
}
