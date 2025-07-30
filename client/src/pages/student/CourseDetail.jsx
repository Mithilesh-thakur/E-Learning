import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import axios from "axios";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import ReactPlayer from "react-player";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import CourseDiscussion from "@/components/CourseDiscussion";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const currentUserId = useSelector((state) => state.auth.user?._id);

  const { data, isLoading, isError, refetch } = useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) return <h1 className="text-center mt-10">Loading...</h1>;
  if (isError) return <h1 className="text-center text-red-500 mt-10">Failed to load course details</h1>;

  const { course, purchased } = data;

  const handleEnroll = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/v1/purchase/enroll",
        { courseId },
        { withCredentials: true }
      );
      toast.success("Enrolled Successfully!");
      // Refetch the data to update the purchased status
      await refetch();
    } catch {
      toast.error("Failed to enroll in course");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-20 pb-10 px-2 md:px-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 items-start">
        {/* Video & Actions */}
        <div className="w-full md:w-2/5">
          <Card className="rounded-2xl shadow-md border border-purple-100">
            <CardContent className="p-4 space-y-4">
              <div className="aspect-video overflow-hidden rounded-xl border border-purple-100">
                <ReactPlayer
                  url={course?.lectures?.[0]?.videoUrl}
                  controls
                  width="100%"
                  height="100%"
                />
              </div>
              <h4 className="text-base font-semibold text-purple-700">
                {course?.lectures?.[0]?.lectureTitle || "Preview"}
              </h4>
              <Separator className="bg-purple-100" />
            </CardContent>
            <CardFooter className="p-4">
              {purchased ? (
                <Button className="w-full bg-purple-700 text-white font-bold text-lg py-2 rounded-xl shadow-sm hover:bg-purple-800" onClick={() => navigate(`/course-progress/${courseId}`)}>
                  Continue Course
                </Button>
              ) : (
                <Button className="w-full bg-purple-700 text-white font-bold text-lg py-2 rounded-xl shadow-sm hover:bg-purple-800" onClick={handleEnroll}>
                  Enroll for Free
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        {/* Info & Content */}
        <div className="flex-1 w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-purple-800">{course?.courseTitle}</h1>
            <p className="text-lg text-purple-600 mb-2 font-semibold italic">{course?.subTitle}</p>
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><BadgeInfo size={16} /> Last updated {course?.createdAt?.split("T")[0]}</span>
              <span>• Students Enrolled: {course?.enrolledStudents?.length || 0}</span>
            </div>
            <Separator className="my-4 bg-purple-100" />
            <div className="flex items-center gap-4 mt-4">
              <img
                src={course?.creator?.photoUrl || "https://github.com/shadcn.png"}
                alt={course?.creator?.name || "Instructor"}
                className="w-14 h-14 rounded-full border-2 border-purple-300 shadow"
              />
              <div>
                <div className="text-base font-bold text-purple-700">{course?.creator?.name}</div>
                <div className="text-xs text-gray-500 italic">Instructor</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-8">
            <h3 className="text-xl font-bold mb-4 text-purple-700">Course Description</h3>
            <p
              className="text-gray-700 text-base leading-relaxed mb-8"
              dangerouslySetInnerHTML={{ __html: course?.description }}
            />
            <Card className="bg-white border border-purple-100 shadow rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-purple-700">Course Content</CardTitle>
                <CardDescription className="text-gray-500">
                  {course?.lectures?.length || 0} Lecture{course?.lectures?.length !== 1 && "s"} included
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.lectures.map((lecture, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-purple-50 transition"
                  >
                    {lecture.isPreviewFree ? (
                      <PlayCircle size={16} className="text-green-500" />
                    ) : (
                      <Lock size={16} className="text-purple-400" />
                    )}
                    <span className="text-gray-800 font-medium">{lecture.lectureTitle}</span>

                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          {/* Course Discussion Section */}
          <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-8">
            <h3 className="text-xl font-bold mb-4 text-purple-700">Course Discussion</h3>
            <CourseDiscussion courseId={courseId} token={localStorage.getItem("token")} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
