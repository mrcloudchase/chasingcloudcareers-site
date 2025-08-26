import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

function FounderCard({name, title, description, background, specialties, connect}: {
  name: string;
  title: string;
  description: string;
  background: string;
  specialties: string;
  connect: string;
}) {
  return (
    <div className="col col--6">
      <div className="card margin-bottom--lg">
        <div className="card__header">
          <Heading as="h3">{name}</Heading>
          <p className="text--italic">{title}</p>
        </div>
        <div className="card__body">
          <p>{description}</p>
          <div className="margin-top--md">
            <p><strong>Background:</strong> {background}</p>
            <p><strong>Specialties:</strong> {specialties}</p>
            <p><strong>Connect:</strong> {connect}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LearningPathCard({title, description}: {title: string; description: string}) {
  return (
    <div className="col col--4">
      <div className="card margin-bottom--md">
        <div className="card__header">
          <Heading as="h4">{title}</Heading>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

function ValueCard({icon, title, description}: {icon: string; title: string; description: string}) {
  return (
    <div className="col col--6">
      <div className="text--center margin-bottom--lg">
        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>{icon}</div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function About(): ReactNode {
  return (
    <Layout
      title="About Us"
      description="Learn about Chasing Cloud Careers, our mission to democratize engineering education, and meet our founders Chase Dovey and Emma Schwarz.">
      <div className="container margin-vert--lg">
        {/* Hero Section */}
        <div className="text--center margin-bottom--xl">
          <Heading as="h1" className="hero__title">
            About Chasing Cloud Careers
          </Heading>
          <p className="hero__subtitle">
            Democratizing access to engineering education through curated learning paths
          </p>
        </div>

        {/* Who We Are */}
        <section className="margin-bottom--xl">
          <Heading as="h2" className="text-gradient">Who We Are</Heading>
          <p className="text--large">
            <strong>Chasing Cloud Careers</strong> is a community-driven platform dedicated to democratizing access to engineering education. 
            We believe that everyone deserves the opportunity to build a successful career in technology, regardless of their background or financial situation.
          </p>
        </section>

        {/* What We Do */}
        <section className="margin-bottom--xl">
          <Heading as="h2" className="text-gradient">What We Do</Heading>
          <p className="text--large margin-bottom--lg">
            We curate and organize the best freely available learning resources from across the internet into structured learning paths. 
            Our mission is simple: <strong>make quality engineering education accessible to everyone</strong>.
          </p>

          {/* Our Approach */}
          <Heading as="h3">Our Approach</Heading>
          <div className="row">
            <ValueCard 
              icon="🎯"
              title="Curated Content"
              description="We don't create courses—we find the best free resources and organize them into logical learning sequences"
            />
            <ValueCard 
              icon="📚"
              title="Structured Learning"
              description="Each learning path is carefully designed to take you from beginner to job-ready"
            />
            <ValueCard 
              icon="🌍"
              title="Community-Driven"
              description="Built by engineers, for engineers, with input from our growing community"
            />
            <ValueCard 
              icon="💰"
              title="Always Free"
              description="All resources we recommend are completely free—no paywalls, no subscriptions"
            />
          </div>
        </section>

        {/* Learning Paths */}
        <section className="margin-bottom--xl">
          <Heading as="h2" className="text-gradient">Learning Paths We Offer</Heading>
          <p className="margin-bottom--lg">We currently maintain six comprehensive learning paths:</p>
          
          <div className="row">
            <LearningPathCard 
              title="Support Engineering"
              description="Technical support, troubleshooting, and customer success"
            />
            <LearningPathCard 
              title="Linux Engineering"
              description="Systems administration, shell scripting, and server management"
            />
            <LearningPathCard 
              title="Cloud Engineering"
              description="AWS, Azure, GCP, and cloud-native technologies"
            />
            <LearningPathCard 
              title="DevOps Engineering"
              description="CI/CD, containerization, monitoring, and automation"
            />
            <LearningPathCard 
              title="AI Engineering"
              description="MLOps, model deployment, and AI infrastructure"
            />
            <LearningPathCard 
              title="Research Engineering"
              description="Cutting-edge research and development in emerging technologies"
            />
          </div>
        </section>

        {/* Meet Our Founders */}
        <section className="margin-bottom--xl">
          <Heading as="h2" className="text-gradient">Meet Our Founders</Heading>
          <div className="row">
            <FounderCard 
              name="Chase Dovey"
              title="Co-Founder & Lead Curator"
              description="Chase brings years of experience in cloud engineering and technical education. Passionate about making complex technologies accessible to everyone, Chase focuses on curating cloud and infrastructure learning paths."
              background="[Add Chase's background details]"
              specialties="[Add Chase's specialties]"
              connect="[Add social links]"
            />
            <FounderCard 
              name="Emma Schwarz"
              title="Co-Founder & Community Lead"
              description="Emma leads our community initiatives and ensures our learning paths meet real-world industry needs. With a background in [add background], Emma is dedicated to creating inclusive learning environments."
              background="[Add Emma's background details]"
              specialties="[Add Emma's specialties]"
              connect="[Add social links]"
            />
          </div>
        </section>

        {/* Our Story */}
        <section className="margin-bottom--xl">
          <Heading as="h2" className="text-gradient">Our Story</Heading>
          <div className="card">
            <div className="card__body">
              <p>
                [Add your founding story - how you started, what motivated you to create this platform, key milestones, etc.]
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="margin-bottom--xl">
          <Heading as="h2" className="text-gradient">Our Values</Heading>
          <div className="row">
            <div className="col col--6">
              <div className="margin-bottom--lg">
                <Heading as="h3">🌟 Accessibility First</Heading>
                <p>Education should be free and available to everyone, regardless of economic background.</p>
              </div>
              <div className="margin-bottom--lg">
                <Heading as="h3">🏆 Quality Over Quantity</Heading>
                <p>We carefully vet every resource to ensure it meets our high standards for clarity and usefulness.</p>
              </div>
            </div>
            <div className="col col--6">
              <div className="margin-bottom--lg">
                <Heading as="h3">🤝 Community-Driven</Heading>
                <p>Our learning paths evolve based on feedback from real learners and industry professionals.</p>
              </div>
              <div className="margin-bottom--lg">
                <Heading as="h3">🔍 Transparency</Heading>
                <p>We're open about our curation process and welcome community contributions to improve our paths.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Get Involved */}
        <section className="margin-bottom--xl">
          <Heading as="h2" className="text-gradient">Get Involved</Heading>
          <div className="row">
            <div className="col col--4">
              <div className="text--center margin-bottom--lg">
                <Heading as="h3">📚 For Learners</Heading>
                <ul className="text--left">
                  <li>Choose a learning path that matches your career goals</li>
                  <li>Join our Discord community for support and networking</li>
                  <li>Share your progress and help motivate others</li>
                </ul>
              </div>
            </div>
            <div className="col col--4">
              <div className="text--center margin-bottom--lg">
                <Heading as="h3">🛠️ For Contributors</Heading>
                <ul className="text--left">
                  <li>Suggest new resources for our learning paths</li>
                  <li>Help us review and update existing content</li>
                  <li>Share your expertise by mentoring other learners</li>
                </ul>
              </div>
            </div>
            <div className="col col--4">
              <div className="text--center margin-bottom--lg">
                <Heading as="h3">🏢 For Employers</Heading>
                <ul className="text--left">
                  <li>Partner with us to understand what skills our learners are developing</li>
                  <li>Provide feedback on industry skill requirements</li>
                  <li>Connect with our community of motivated career changers</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="margin-bottom--xl">
          <Heading as="h2" className="text-gradient">Contact Us</Heading>
          <div className="card">
            <div className="card__body">
              <p className="text--large margin-bottom--md">
                Have questions, suggestions, or want to get involved? We'd love to hear from you!
              </p>
              <ul>
                <li><strong>Email:</strong> [Add contact email]</li>
                <li><strong>Discord:</strong> [Add Discord invite link]</li>
                <li><strong>GitHub:</strong> [Add GitHub organization link]</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text--center">
          <div className="card bg-gradient">
            <div className="card__body">
              <Heading as="h2" style={{color: 'white', marginBottom: '1rem'}}>
                Ready to Start Your Engineering Journey?
              </Heading>
              <p style={{color: 'white', fontSize: '1.2rem', marginBottom: '2rem'}}>
                Explore our learning paths and join thousands of learners building their tech careers.
              </p>
              <Link
                className="button button--secondary button--lg"
                to="/docs/intro">
                Explore Learning Paths
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
