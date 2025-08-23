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
    title: '🛠️ Support Engineering',
    icon: '🛠️',
    description: (
      <>
        Master technical support, troubleshooting, and customer success. 
        Learn to solve complex problems and deliver exceptional user experiences.
      </>
    ),
    link: '/docs/support-engineering/getting-started',
  },
  {
    title: '🐧 Linux Engineering',
    icon: '🐧',
    description: (
      <>
        Become proficient in Linux systems administration, shell scripting, 
        and server management. Build the foundation for modern infrastructure.
      </>
    ),
    link: '/docs/linux-engineering/getting-started',
  },
  {
    title: '☁️ Cloud Engineering',
    icon: '☁️',
    description: (
      <>
        Dive into AWS, Azure, and GCP. Learn infrastructure as code, 
        cloud-native technologies, and scalable architecture patterns.
      </>
    ),
    link: '/docs/cloud-engineering/getting-started',
  },
  {
    title: '🔄 DevOps Engineering',
    icon: '🔄',
    description: (
      <>
        Master CI/CD pipelines, containerization, monitoring, and automation. 
        Bridge the gap between development and operations.
      </>
    ),
    link: '/docs/devops-engineering/getting-started',
  },
  {
    title: '🤖 AI Engineering',
    icon: '🤖',
    description: (
      <>
        Learn MLOps, model deployment, and AI infrastructure. 
        Build and scale machine learning systems in production.
      </>
    ),
    link: '/docs/ai-engineering/getting-started',
  },
  {
    title: '🎯 Career Focused',
    icon: '🎯',
    description: (
      <>
        Every learning path is designed to get you job-ready with practical skills, 
        real-world projects, and industry best practices.
      </>
    ),
    link: '/docs/intro',
  },
];

function Feature({title, icon, description, link}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="learning-path-card">
        <div className="text--center">
          <span className="learning-path-icon">{icon}</span>
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3" className="text-gradient">{title}</Heading>
          <p>{description}</p>
          <a 
            href={link} 
            className="button button--primary button--sm"
            style={{marginTop: '1rem'}}
          >
            Start Learning →
          </a>
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
            🚀 Choose Your Engineering Path
          </Heading>
          <p className="hero__subtitle" style={{color: 'var(--ifm-color-content-secondary)'}}>
            Free, comprehensive learning paths designed to get you hired in tech
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
                  ✨ Why Choose Chasing Cloud Careers?
                </Heading>
                <div className="row margin-top--lg">
                  <div className="col col--3">
                    <div className="text--center">
                      <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>📚</div>
                      <h4>100% Free Resources</h4>
                      <p>Curated from the best free content available online</p>
                    </div>
                  </div>
                  <div className="col col--3">
                    <div className="text--center">
                      <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>🛠️</div>
                      <h4>Hands-on Practice</h4>
                      <p>Real projects and labs to build your portfolio</p>
                    </div>
                  </div>
                  <div className="col col--3">
                    <div className="text--center">
                      <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>🎯</div>
                      <h4>Job-Ready Skills</h4>
                      <p>Industry-relevant curriculum designed by professionals</p>
                    </div>
                  </div>
                  <div className="col col--3">
                    <div className="text--center">
                      <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>🚀</div>
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