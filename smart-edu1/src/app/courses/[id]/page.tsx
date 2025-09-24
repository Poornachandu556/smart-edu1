import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { courses } from "@/data/courses";
import { EnrollControls } from "./EnrollControls";
import { CourseDetailClient } from "./CourseDetailClient";

export default function CourseDetail({ params }: { params: { id: string } }) {
  const course = courses.find((c) => c.id === params.id);
  if (!course) return notFound();
  
  return <CourseDetailClient course={course} />;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const course = courses.find((c) => c.id === params.id);
  if (!course) return { title: "Course not found" };
  return {
    title: `${course.title} — SmartEdu`,
    description: course.description,
    openGraph: {
      title: `${course.title} — SmartEdu`,
      description: course.description,
      images: [{ url: course.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} — SmartEdu`,
      description: course.description,
      images: [course.image],
    },
  };
}


