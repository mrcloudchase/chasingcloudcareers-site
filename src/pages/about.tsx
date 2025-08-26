import React from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

export default function About(): JSX.Element {
  return (
    <Layout
      title="About"
      description="Learn about Chasing Cloud Careers and our mission to democratize engineering education">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            
            {/* Header */}
            <div className="text--center margin-bottom--xl">
              <Heading as="h1">About Chasing Cloud Careers</Heading>
              <p className="hero__subtitle">
                Democratizing access to engineering education through curated learning paths
              </p>
            </div>

            {/* Who We Are */}
            <section className="margin-bottom--xl">
              <Heading as="h2">Who We Are</Heading>
              <p>
                We are a community-driven platform dedicated to making engineering education accessible to everyone. 
                Our mission is to curate and organize the best freely available learning resources from across the 
                internet into structured learning paths that help people transition into tech careers or expand their 
                existing skills.
              </p>
            </section>

            {/* What We Do */}
            <section className="margin-bottom--xl">
              <Heading as="h2">What We Do</Heading>
              <p>
                We don't create courses or content. Instead, we carefully curate existing free resources from the web 
                and organize them into logical, progressive learning paths. Each path is designed to take you from 
                beginner to job-ready in specific engineering disciplines.
              </p>
              <p>
                Our learning paths cover:
              </p>
              <ul>
                <li><strong>Support Engineering</strong> - Technical support and customer success</li>
                <li><strong>Linux Engineering</strong> - Systems administration and server management</li>
                <li><strong>Cloud Engineering</strong> - AWS, Azure, GCP, and cloud-native technologies</li>
                <li><strong>DevOps Engineering</strong> - CI/CD, containerization, and automation</li>
                <li><strong>AI Engineering</strong> - MLOps, model deployment, and AI infrastructure</li>
                <li><strong>Research Engineering</strong> - Cutting-edge research and development</li>
              </ul>
            </section>

            {/* Our Founders */}
            <section className="margin-bottom--xl">
              <Heading as="h2">Our Founders</Heading>
              
              <div className="row margin-bottom--lg">
                <div className="col col--6">
                  <div className="card">
                    <div className="card__header">
                      <Heading as="h3">Chase Dovey</Heading>
                      <p><em>Co-Founder</em></p>
                    </div>
                    <div className="card__body">
                      <p>
                        Chase brings extensive experience in cloud engineering and technical education. 
                        Passionate about making complex technologies accessible, Chase focuses on curating 
                        our cloud and infrastructure learning paths.
                      </p>
                      <p><strong>Specialties:</strong> Cloud Architecture, DevOps, Infrastructure</p>
                    </div>
                  </div>
                </div>
                
                <div className="col col--6">
                  <div className="card">
                    <div className="card__header">
                      <Heading as="h3">Emma Schwarz</Heading>
                      <p><em>Co-Founder</em></p>
                    </div>
                    <div className="card__body">
                      <p>
                        Emma leads our community initiatives and ensures our learning paths meet real-world 
                        industry needs. With a background in engineering education, Emma is dedicated to 
                        creating inclusive learning environments.
                      </p>
                      <p><strong>Specialties:</strong> Community Building, Education, AI/ML</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Our Mission */}
            <section className="margin-bottom--xl">
              <Heading as="h2">Our Mission</Heading>
              <p>
                We believe that quality engineering education should be accessible to everyone, regardless of 
                their financial situation or background. By curating the best free resources available online 
                and organizing them into structured learning paths, we're removing barriers to entry in the 
                tech industry.
              </p>
              <p>
                Our goal is to help motivated individuals build the skills they need to launch successful 
                engineering careers through self-directed learning.
              </p>
            </section>

            {/* Why We Do This */}
            <section className="margin-bottom--xl">
              <Heading as="h2">Why We Do This</Heading>
              <p>
                The internet is full of amazing free educational content, but it can be overwhelming to know 
                where to start or how to progress. We solve this problem by:
              </p>
              <ul>
                <li>Carefully vetting resources for quality and relevance</li>
                <li>Organizing content into logical learning sequences</li>
                <li>Providing clear pathways from beginner to job-ready</li>
                <li>Building a supportive community of learners</li>
                <li>Keeping everything completely free and accessible</li>
              </ul>
            </section>

            {/* Get Involved */}
            <section className="margin-bottom--xl">
              <Heading as="h2">Get Involved</Heading>
              <p>
                Whether you're just starting your engineering journey or looking to expand into new areas, 
                we're here to help. Join our community, explore our learning paths, and connect with other 
                learners who are on similar journeys.
              </p>
              <div className="text--center margin-top--lg">
                <a 
                  href="https://discord.gg/your-discord-invite" 
                  className="button button--primary button--lg margin-right--md"
                  target="_blank" 
                  rel="noopener noreferrer">
                  Join Our Community
                </a>
                <a 
                  href="/docs/intro" 
                  className="button button--secondary button--lg">
                  Explore Learning Paths
                </a>
              </div>
            </section>

          </div>
        </div>
      </div>
    </Layout>
  );
}
