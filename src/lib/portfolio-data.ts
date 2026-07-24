export interface Project {
  id: string;
  title: string;
  description: string;
  category: "Analyst" | "Engineer" | "Scientist";
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export interface Skill {
  name: string;
  category: "Languages" | "Data Engineering" | "Analytics & BI" | "Data Science & ML";
  level: number; // 1-5
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string[];
  track: "analyst" | "engineer" | "scientist";
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  readingTime: string;
}

export interface JourneyMilestone {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  type: "academic" | "career" | "project";
}

export const portfolioData = {
  profile: {
    name: "Aniket Saini",
    title: "Data Analyst → Data Engineer → Data Scientist",
    subtitle: "Master's Student in Computer Science / Data Analytics",
    bio: "Bridging the gap between raw data analytics, robust data pipelines, and predictive machine learning models. Specialize in designing clean ETL architectures and training deep learning pipelines.",
    email: "aniket.saini@example.com",
    github: "https://github.com/orphanNighWolf",
    linkedin: "https://linkedin.com",
  },
  skills: [
    { name: "Python", category: "Languages", level: 5 },
    { name: "SQL", category: "Languages", level: 5 },
    { name: "R", category: "Languages", level: 3 },
    { name: "dbt (Data Build Tool)", category: "Data Engineering", level: 5 },
    { name: "Apache Airflow", category: "Data Engineering", level: 4 },
    { name: "Snowflake", category: "Data Engineering", level: 4 },
    { name: "Apache Spark / PySpark", category: "Data Engineering", level: 4 },
    { name: "PostgreSQL", category: "Data Engineering", level: 5 },
    { name: "Tableau", category: "Analytics & BI", level: 5 },
    { name: "PowerBI", category: "Analytics & BI", level: 4 },
    { name: "Looker Studio", category: "Analytics & BI", level: 4 },
    { name: "scikit-learn", category: "Data Science & ML", level: 5 },
    { name: "PyTorch", category: "Data Science & ML", level: 4 },
    { name: "TensorFlow", category: "Data Science & ML", level: 4 },
    { name: "MLflow", category: "Data Science & ML", level: 4 },
  ] as Skill[],
  projects: [
    {
      id: "1",
      title: "Automated ETL Pipeline for Retail Data Analytics",
      description: "Designed and built an end-to-end ELT pipeline processing daily retail transactions from operational databases into Snowflake using Apache Airflow and dbt, resolving reporting latencies.",
      category: "Engineer",
      tags: ["Airflow", "dbt", "Snowflake", "Python", "SQL"],
      githubUrl: "https://github.com/orphanNighWolf",
    },
    {
      id: "2",
      title: "Predictive Analytics on Customer Churn and LTV",
      description: "Built customer lifetime value predictive models using XGBoost and scikit-learn. Segmented user behaviors and built interactive Looker BI dashboards to present insights.",
      category: "Scientist",
      tags: ["Python", "scikit-learn", "XGBoost", "Looker", "SQL"],
      githubUrl: "https://github.com/orphanNighWolf",
    },
    {
      id: "3",
      title: "Real-time Streaming Dashboard for Financial Assets",
      description: "Ingested live financial market tickers via Apache Kafka, transformed real-time streams using PySpark, and built an interactive dashboard displaying analytics.",
      category: "Analyst",
      tags: ["PySpark", "Kafka", "Tableau", "SQL", "Python"],
      githubUrl: "https://github.com/orphanNighWolf",
    },
    {
      id: "4",
      title: "Neural Network Architecture for Genomic Sequencing",
      description: "Research project building a Convolutional Neural Network (CNN) in PyTorch to classify genomics sequences, optimizing sequence detection accuracy.",
      category: "Scientist",
      tags: ["PyTorch", "Python", "Deep Learning", "TensorFlow"],
      githubUrl: "https://github.com/orphanNighWolf",
    }
  ] as Project[],
  experience: [
    {
      role: "Graduate Assistant / Data Scientist Track",
      company: "University Research Lab",
      period: "2025 - Present",
      description: [
        "Developing predictive ML models using scikit-learn and PyTorch to analyze genomic sequence datasets.",
        "Refining data pipeline architectures to accelerate research processing speeds.",
      ],
      track: "scientist",
    },
    {
      role: "Data Engineer Intern",
      company: "CloudData Corp",
      period: "Summer 2024",
      description: [
        "Configured robust ELT pipelines using Airflow, dbt, and Snowflake, scaling analytical data warehouse performance.",
        "Created SQL transformations that decreased analytical query runtimes by 25%.",
      ],
      track: "engineer",
    },
    {
      role: "Data Analyst",
      company: "Insights Financial",
      period: "2023 - 2024",
      description: [
        "Analyzed transaction behaviors and designed executive Tableau dashboards for tracking key business metrics.",
        "Wrote complex PostgreSQL analytical queries to identify customer retention drop-offs.",
      ],
      track: "analyst",
    }
  ] as Experience[],
  blogs: [
    {
      id: "blog-1",
      slug: "demystifying-dbt-testing-in-production",
      title: "Demystifying dbt Testing in Production Environments",
      excerpt: "Why model verification matters. A look into setting up singular, generic, and source tests in a modern data pipeline flow.",
      content: "Testing in data engineering is often treated as an afterthought. However, setting up schema and referential integrity tests inside dbt (Data Build Tool) is critical to maintaining reporting trust. In this post, we walk through defining test constraints on retail data sources...",
      date: "July 12, 2026",
      category: "Data Engineering",
      readingTime: "4 min read",
    },
    {
      id: "blog-2",
      slug: "scikit-learn-to-pytorch-neural-networks",
      title: "Shifting from scikit-learn to PyTorch for Tabular Data",
      excerpt: "When should you switch from linear models to neural networks? Exploring tabular deep learning benefits and challenges.",
      content: "For most tabular data problems, tree-based models like XGBoost or simple linear models in scikit-learn perform exceptionally well. But when target variables possess complex non-linear combinations, multi-layer perceptrons in PyTorch can discover hidden features...",
      date: "June 28, 2026",
      category: "Data Science",
      readingTime: "6 min read",
    }
  ] as Blog[],
  journey: [
    {
      year: "2025",
      title: "Enrolled in Computer Science Master's",
      subtitle: "Focusing on Data Science & Machine Learning",
      description: "Taking advanced coursework in Deep Learning, Large Scale Data Processing, and Advanced Database Systems.",
      type: "academic",
    },
    {
      year: "2024",
      title: "Data Engineering Internship",
      subtitle: "CloudData Corp",
      description: "Earned hands-on experience in industrial pipelines, deploying dbt configurations and Airflow scheduler tasks.",
      type: "career",
    },
    {
      year: "2023",
      title: "Started as Data Analyst",
      subtitle: "Insights Financial",
      description: "Began technical journey mapping business requests to SQL queries and translating findings into interactive Tableau dashboards.",
      type: "career",
    }
  ] as JourneyMilestone[],
};
