import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
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
        Learning path for technical support, troubleshooting, and customer success. 
        Develop problem-solving skills and user experience expertise through curated free resources.
      </>
    ),
    link: '/docs/support-engineering/getting-started',
  },
  {
    title: 'Linux Engineering',
    icon: '',
    description: (
      <>
        Learning path for Linux systems administration, shell scripting, 
        and server management. Build foundational infrastructure skills through curated free resources.
      </>
    ),
    link: '/docs/linux-engineering/getting-started',
  },
  {
    title: 'Cloud Engineering',
    icon: '',
    description: (
      <>
        Learning path covering AWS, Azure, and GCP. Explore infrastructure as code, 
        cloud-native technologies, and scalable architecture patterns through curated free resources.
      </>
    ),
    link: '/docs/cloud-engineering/getting-started',
  },
  {
    title: 'DevOps Engineering',
    icon: '',
    description: (
      <>
        Learning path for CI/CD pipelines, containerization, monitoring, and automation. 
        Bridge the gap between development and operations through curated free resources.
      </>
    ),
    link: '/docs/devops-engineering/getting-started',
  },
  {
    title: 'AI Engineering',
    icon: '',
    description: (
      <>
        Learning path for MLOps, model deployment, and AI infrastructure. 
        Understand building and scaling machine learning systems through curated free resources.
      </>
    ),
    link: '/docs/ai-engineering/getting-started',
  },
  {
    title: 'Research Engineering',
    icon: '',
    description: (
      <>
        Learning path for cutting-edge research and development in AI, ML, and emerging technologies. 
        Bridge the gap between research and practical implementation through curated free resources.
      </>
    ),
    link: '/docs/research-engineering/getting-started',
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
            {isExternalLink ? (
              <a 
                href={link} 
                className="button button--primary button--sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Start Learning →
              </a>
            ) : (
              <Link 
                to={link} 
                className="button button--primary button--sm"
              >
                Start Learning →
              </Link>
            )}
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
            Six learning paths curated from freely available resources for career development and skill building
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