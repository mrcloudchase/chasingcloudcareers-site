import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Support Engineering',
    icon: '',
    description: (
      <>
        Curated resources for technical support, troubleshooting, and customer success. 
        Free materials to help you develop problem-solving skills and user experience expertise.
      </>
    ),
    link: '/docs/support-engineering/getting-started',
  },
  {
    title: 'Linux Engineering',
    icon: '',
    description: (
      <>
        Organized collection of Linux systems administration, shell scripting, 
        and server management resources. Build foundational infrastructure skills through self-study.
      </>
    ),
    link: '/docs/linux-engineering/getting-started',
  },
  {
    title: 'Cloud Engineering',
    icon: '',
    description: (
      <>
        Comprehensive resources covering AWS, Azure, and GCP. Curated materials on infrastructure as code, 
        cloud-native technologies, and scalable architecture patterns.
      </>
    ),
    link: '/docs/cloud-engineering/getting-started',
  },
  {
    title: 'DevOps Engineering',
    icon: '',
    description: (
      <>
        Structured resources for CI/CD pipelines, containerization, monitoring, and automation. 
        Materials to help bridge the gap between development and operations through self-directed learning.
      </>
    ),
    link: '/docs/devops-engineering/getting-started',
  },
  {
    title: 'AI Engineering',
    icon: '',
    description: (
      <>
        Curated resources for MLOps, model deployment, and AI infrastructure. 
        Free materials to help you understand building and scaling machine learning systems.
      </>
    ),
    link: '/docs/ai-engineering/getting-started',
  },
  {
    title: 'Research Engineering',
    icon: '',
    description: (
      <>
        Resources for cutting-edge research and development in AI, ML, and emerging technologies. 
        Materials to help bridge the gap between research and practical implementation.
      </>
    ),
    link: 'https://averagejoeslab.com',
  },
];

function Feature({title, icon, description, link}: FeatureItem) {
  const isExternalLink = link.startsWith('http');
  
  return (
    <div className={clsx('col col--4')}>
      <div className="learning-path-card">
        {icon && (
          <div className="text--center">
            <span className="learning-path-icon learning-path-icon-gradient">{icon}</span>
          </div>
        )}
        <div className="text--center padding-horiz--md">
          <Heading as="h3" className="text-gradient">{title}</Heading>
          <div className="learning-path-description">
            <p>{description}</p>
          </div>
          <div className="learning-path-button-container">
            <a 
              href={link} 
              className="button button--primary button--sm"
              {...(isExternalLink && {
                target: '_blank',
                rel: 'noopener noreferrer'
              })}
            >
              Start Learning →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center margin-bottom--xl">
          <Heading as="h2" className="text-gradient">
            Choose Your Engineering Path
          </Heading>
          <p className="hero__subtitle" style={{color: 'var(--ifm-color-content-secondary)'}}>
            Six curated collections of free resources organized for career development and skill building
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        
        {/* Additional Features Section */}
        <div className="margin-top--xl">
          <div className="row">
            <div className="col col--12">
              <div className="text--center bg-gradient-subtle" style={{
                padding: '3rem 2rem',
                borderRadius: 'var(--ifm-card-border-radius)',
                border: '1px solid rgba(99, 102, 241, 0.1)'
              }}>
                <Heading as="h2" className="text-gradient">
                  Built by the Community, For the Community
                </Heading>
                <div className="row margin-top--lg">
                  <div className="col col--3">
                    <div className="text--center">
                      <h4>100% Free Resources</h4>
                      <p>Curated from the best free content available online</p>
                    </div>
                  </div>
                  <div className="col col--3">
                    <div className="text--center">
                      <h4>Hands-on Practice</h4>
                      <p>Real projects and labs to build your portfolio</p>
                    </div>
                  </div>
                  <div className="col col--3">
                    <div className="text--center">
                      <h4>Job-Ready Skills</h4>
                      <p>Industry-relevant curriculum designed by professionals</p>
                    </div>
                  </div>
                  <div className="col col--3">
                    <div className="text--center">
                      <h4>Career Guidance</h4>
                      <p>Tips for landing your first role and advancing your career</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}