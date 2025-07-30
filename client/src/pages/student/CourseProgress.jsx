import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle2, CirclePlay } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import VideoPlayer from "@/components/VideoPlayer";
import CircularProgress from "@/components/ui/CircularProgress";
import ReactPlayer from "react-player";
import LectureComments from "@/components/LectureComments";

const CourseProgress = () => {
  const { courseId } = useParams();
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse, { data: markCompleteData, isSuccess: completedSuccess }] =
    useCompleteCourseMutation();
  const [inCompleteCourse, { data: markInCompleteData, isSuccess: inCompletedSuccess }] =
    useInCompleteCourseMutation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [videoProgress, setVideoProgress] = useState(0);
  const [markedCompleted, setMarkedCompleted] = useState(false);

  useEffect(() => {
    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData?.message);
    }
    if (inCompletedSuccess) {
      refetch();
      toast.success(markInCompleteData?.message);
    }
  }, [completedSuccess, inCompletedSuccess, markCompleteData?.message, markInCompleteData?.message, refetch]);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data || !data.data) return <p>Failed to load course details</p>;

  const { courseDetails, progress, completed } = data.data;
  const lectures = courseDetails.lectures || [];
  const currentLecture = lectures[currentIndex] || null;

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const handleLectureProgress = async (lectureId) => {
    try {
      await updateLectureProgress({ courseId, lectureId });
      refetch();
    } catch (error) {
      console.error("Failed to mark lecture complete:", error);
    }
  };

  const handleProgress = (state) => {
    const percent = state.played * 100;
    setVideoProgress(percent);

    if (percent >= 90 && !markedCompleted) {
      setMarkedCompleted(true);
      if (!completedLectures.includes(currentLecture._id)) {
        setCompletedLectures((prev) => [...prev, currentLecture._id]);
      }
      handleLectureProgress(currentLecture._id);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetProgress();
    }
  };

  const handleNext = () => {
    if (currentIndex < lectures.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetProgress();
    }
  };

  const handleLectureClick = (index) => {
    setCurrentIndex(index);
    resetProgress();
  };

  const resetProgress = () => {
    setVideoProgress(0);
    setMarkedCompleted(false);
  };

  const videoSrc = currentLecture?.hlsUrl || currentLecture?.videoUrl;
  const isHls = videoSrc?.endsWith(".m3u8");

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{courseDetails.courseTitle}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Video Player */}
        <div className="flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4 bg-white dark:bg-gray-900">
          {!isHls ? (
            <ReactPlayer
              url={videoSrc}
              controls
              width="100%"
              height="400px"
              onProgress={handleProgress}
              onStart={() => setMarkedCompleted(false)}
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload",
                  },
                },
              }}
            />
          ) : (
            <div style={{ height: "400px" }}>
              <VideoPlayer
                src={videoSrc}
                isHls={isHls}
                onEnded={() => handleLectureProgress(currentLecture._id)}
              />
            </div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <h3 className="font-medium text-lg">
              Lecture {currentIndex + 1}: {currentLecture.lectureTitle}
            </h3>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <Button onClick={handlePrevious} disabled={currentIndex === 0}>
              Previous
            </Button>
            <Button onClick={handleNext} disabled={currentIndex === lectures.length - 1}>
              Next
            </Button>
          </div>

          {/* Lecture Comments Section */}
          <LectureComments lectureId={currentLecture?._id} token={localStorage.getItem("token")} />
        </div>

        {/* Lecture List */}
        <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
          <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
          <div className="space-y-2">
            {lectures.map((lecture, index) => {
              const isCurrent = index === currentIndex;
              const completed =
                isLectureCompleted(lecture._id) || completedLectures.includes(lecture._id);

              return (
                <Card
                  key={lecture._id}
                  className={`cursor-pointer transition ${
                    isCurrent
                      ? "bg-gray-200 dark:bg-gray-800"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleLectureClick(index)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                      {completed ? (
                        <CheckCircle2 size={28} className="text-green-500" />
                      ) : isCurrent ? (
                        <CircularProgress value={videoProgress} size={28} />
                      ) : (
                        <CirclePlay size={28} className="text-gray-500" />
                      )}
                      <CardTitle className="text-sm font-medium">
                        {lecture.lectureTitle}
                      </CardTitle>
                    </div>

                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
