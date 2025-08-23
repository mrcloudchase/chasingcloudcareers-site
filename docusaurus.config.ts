import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Chasing Cloud Careers',
  tagline: 'Free learning paths for engineering careers - Support, Linux, Cloud, DevOps, and AI Engineering',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://mrcloudchase.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/chasingcloudcareers-site/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'mrcloudchase', // Usually your GitHub org/user name.
  projectName: 'chasingcloudcareers-site', // Usually your repo name.
  
  // Deployment settings
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/mrcloudchase/chasingcloudcareers-site/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/mrcloudchase/chasingcloudcareers-site/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/logo.png',
    navbar: {
      title: 'Chasing Cloud Careers',
      logo: {
        alt: 'Chasing Cloud Careers Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Learning Paths',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/mrcloudchase/chasingcloudcareers-site',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learning Paths',
          items: [
            {
              label: 'Get Started',
              to: '/docs/intro',
            },
            {
              label: 'Support Engineering',
              to: '/docs/support-engineering/getting-started',
            },
            {
              label: 'Linux Engineering',
              to: '/docs/linux-engineering/getting-started',
            },
            {
              label: 'Cloud Engineering',
              to: '/docs/cloud-engineering/getting-started',
            },
            {
              label: 'DevOps Engineering',
              to: '/docs/devops-engineering/getting-started',
            },
            {
              label: 'AI Engineering',
              to: '/docs/ai-engineering/getting-started',
            },
            {
              label: 'Research Engineering',
              href: 'https://averagejoeslab.com',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/mrcloudchase/chasingcloudcareers-site',
            },
            {
              label: 'Website',
              href: 'https://chasingcloudcareers.com',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'About',
              to: '/docs/intro',
            },
          ],
        },
      ],
      copyright: `Copyright © 2023-${new Date().getFullYear()} Chasing Cloud Careers.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
