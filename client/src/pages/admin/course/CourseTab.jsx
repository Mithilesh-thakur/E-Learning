// import RichTextEditor from "@/components/RichTextEditor";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   useEditCourseMutation,
//   useGetCourseByIdQuery,
//   usePublishCourseMutation,
// } from "@/features/api/courseApi";
// import { Loader2 } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "sonner";

// const CourseTab = () => {
//   const [input, setInput] = useState({
//     courseTitle: "",
//     subTitle: "",
//     description: "",
//     category: "",
//     courseLevel: "",
//     coursePrice: "",
//     courseThumbnail: null,
//   });

//   const [previewThumbnail, setPreviewThumbnail] = useState("");
//   const navigate = useNavigate();
//   const { courseId } = useParams();

//   const {
//     data: courseByIdData,
//     isLoading: courseByIdLoading,
//     refetch,
//   } = useGetCourseByIdQuery(courseId);

//   const [editCourse, { data, isLoading, isSuccess, error }] =
//     useEditCourseMutation();

//   const [publishCourse] = usePublishCourseMutation();

//   useEffect(() => {
//     if (courseByIdData?.course) {
//       const course = courseByIdData.course;
//       setInput({
//         courseTitle: course.courseTitle || "",
//         subTitle: course.subTitle || "",
//         description: course.description || "",
//         category: course.category || "",
//         courseLevel: course.courseLevel || "",
//         coursePrice: course.coursePrice || "",
//         courseThumbnail: null,
//       });

//       setPreviewThumbnail(course.courseThumbnail || "");
//     }
//   }, [courseByIdData]);

//   const changeEventHandler = (e) => {
//     const { name, value } = e.target;
//     setInput((prev) => ({ ...prev, [name]: value }));
//   };

//   const selectCategory = (value) => {
//     setInput((prev) => ({ ...prev, category: value }));
//   };

//   const selectCourseLevel = (value) => {
//     setInput((prev) => ({ ...prev, courseLevel: value }));
//   };

//   const selectThumbnail = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setInput((prev) => ({ ...prev, courseThumbnail: file }));
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewThumbnail(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const updateCourseHandler = async () => {
//     const formData = new FormData();
//     formData.append("courseTitle", input.courseTitle);
//     formData.append("subTitle", input.subTitle);
//     formData.append("description", input.description);
//     formData.append("category", input.category);
//     formData.append("courseLevel", input.courseLevel);
//     formData.append("coursePrice", input.coursePrice);
//     if (input.courseThumbnail) {
//       formData.append("courseThumbnail", input.courseThumbnail);
//     }

//     await editCourse({ formData, courseId });
//   };

//   const publishStatusHandler = async (action) => {
//     try {
//       const response = await publishCourse({ courseId, query: action });
//       if (response?.data) {
//         refetch();
//         toast.success(response.data.message);
//       }
//     } catch (error) {
//       toast.error("Failed to publish/unpublish course");
//     }
//   };

//   useEffect(() => {
//     if (isSuccess && data) {
//       toast.success(data.message || "Course updated successfully.");
//       refetch();
//     }
//     if (error) {
//       toast.error(error?.data?.message || "Update failed.");
//     }
//   }, [isSuccess, error]);

//   if (courseByIdLoading) return <h1>Loading...</h1>;

//   const lectureCount = courseByIdData?.course?.lectures?.length || 0;
//   const isPublished = courseByIdData?.course?.isPublished;

//   return (
//     <Card>
//       <CardHeader className="flex flex-row justify-between">
//         <div>
//           <CardTitle>Basic Course Information</CardTitle>
//           <CardDescription>
//             Make changes to your courses here. Click save when you're done.
//           </CardDescription>
//         </div>
//         <div className="space-x-2">
//           <Button
//             disabled={lectureCount === 0}
//             variant="outline"
//             onClick={() =>
//               publishStatusHandler(isPublished ? "false" : "true")
//             }
//           >
//             {isPublished ? "Unpublish" : "Publish"}
//           </Button>
//           <Button variant="destructive">Remove Course</Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4 mt-5">
//           <div>
//             <Label>Title</Label>
//             <Input
//               type="text"
//               name="courseTitle"
//               value={input.courseTitle}
//               onChange={changeEventHandler}
//               placeholder="Ex. Fullstack developer"
//             />
//           </div>
//           <div>
//             <Label>Subtitle</Label>
//             <Input
//               type="text"
//               name="subTitle"
//               value={input.subTitle}
//               onChange={changeEventHandler}
//               placeholder="Subtitle here..."
//             />
//           </div>
//           <div>
//             <Label>Description</Label>
//             <RichTextEditor input={input} setInput={setInput} />
//           </div>
//           <div className="flex items-center gap-5 flex-wrap">
//             <div>
//               <Label>Category</Label>
//               <Select value={input.category} onValueChange={selectCategory}>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Select a category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     <SelectLabel>Category</SelectLabel>
//                     <SelectItem value="Next JS">Next JS</SelectItem>
//                     <SelectItem value="Data Science">Data Science</SelectItem>
//                     <SelectItem value="Frontend Development">
//                       Frontend Development
//                     </SelectItem>
//                     <SelectItem value="Fullstack Development">
//                       Fullstack Development
//                     </SelectItem>
//                     <SelectItem value="MERN Stack Development">
//                       MERN Stack Development
//                     </SelectItem>
//                     <SelectItem value="Javascript">Javascript</SelectItem>
//                     <SelectItem value="Python">Python</SelectItem>
//                     <SelectItem value="Docker">Docker</SelectItem>
//                     <SelectItem value="MongoDB">MongoDB</SelectItem>
//                     <SelectItem value="HTML">HTML</SelectItem>
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Course Level</Label>
//               <Select
//                 value={input.courseLevel}
//                 onValueChange={selectCourseLevel}
//               >
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Select course level" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectGroup>
//                     <SelectLabel>Level</SelectLabel>
//                     <SelectItem value="Beginner">Beginner</SelectItem>
//                     <SelectItem value="Medium">Medium</SelectItem>
//                     <SelectItem value="Advance">Advance</SelectItem>
//                   </SelectGroup>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Price (INR)</Label>
//               <Input
//                 type="number"
//                 name="coursePrice"
//                 value={input.coursePrice}
//                 onChange={changeEventHandler}
//                 placeholder="Ex. 499"
//                 className="w-[150px]"
//               />
//             </div>
//           </div>
//           <div>
//             <Label>Course Thumbnail</Label>
//             <Input
//               type="file"
//               onChange={selectThumbnail}
//               accept="image/*"
//               className="w-fit"
//             />
//             {previewThumbnail && (
//               <img
//                 src={previewThumbnail}
//                 alt="Preview"
//                 className="h-32 mt-2 border"
//               />
//             )}
//           </div>
//           <div className="flex justify-end gap-2">
//             <Button
//               onClick={() => navigate("/admin/course")}
//               variant="outline"
//             >
//               Cancel
//             </Button>
//             <Button disabled={isLoading} onClick={updateCourseHandler}>
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Please wait
//                 </>
//               ) : (
//                 "Save"
//               )}
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default CourseTab;
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    courseThumbnail: null,
  });

  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const navigate = useNavigate();
  const { courseId } = useParams();

  const {
    data: courseByIdData,
    isLoading: courseByIdLoading,
    refetch,
  } = useGetCourseByIdQuery(courseId);

  const [editCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();

  const [publishCourse] = usePublishCourseMutation();

  useEffect(() => {
    if (courseByIdData?.course) {
      const course = courseByIdData.course;
      setInput({
        courseTitle: course.courseTitle || "",
        subTitle: course.subTitle || "",
        description: course.description || "",
        category: course.category || "",
        courseLevel: course.courseLevel || "",
        courseThumbnail: null,
      });

      setPreviewThumbnail(course.courseThumbnail || "");
    }
  }, [courseByIdData]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const selectCategory = (value) => {
    setInput((prev) => ({ ...prev, category: value }));
  };

  const selectCourseLevel = (value) => {
    setInput((prev) => ({ ...prev, courseLevel: value }));
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput((prev) => ({ ...prev, courseThumbnail: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    if (input.courseThumbnail) {
      formData.append("courseThumbnail", input.courseThumbnail);
    }

    await editCourse({ formData, courseId });
  };

  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({ courseId, query: action });
      if (response?.data) {
        refetch();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to publish/unpublish course");
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data.message || "Course updated successfully.");
      refetch();
    }
    if (error) {
      toast.error(error?.data?.message || "Update failed.");
    }
  }, [isSuccess, error]);

  if (courseByIdLoading) return <h1>Loading...</h1>;

  const lectureCount = courseByIdData?.course?.lectures?.length || 0;
  const isPublished = courseByIdData?.course?.isPublished;

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you're done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button
            disabled={lectureCount === 0}
            variant="outline"
            onClick={() =>
              publishStatusHandler(isPublished ? "false" : "true")
            }
          >
            {isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="destructive">Remove Course</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Fullstack developer"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Subtitle here..."
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            <div>
              <Label>Category</Label>
              <Select value={input.category} onValueChange={selectCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="MERN Stack Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Course Level</Label>
              <Select
                value={input.courseLevel}
                onValueChange={selectCourseLevel}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                alt="Preview"
                className="h-32 mt-2 border"
              />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => navigate("/admin/course")}
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={updateCourseHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
