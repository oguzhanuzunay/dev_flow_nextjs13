import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatAndDivideNumber, getTimeStamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const result = await getQuestionById({ questionId: params.id });
  const author = result.author;
  const { userId: clerkId } = auth();

  let mongoUser;
  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  return (
    <>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${author._id}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={author.picture}
              alt="profile"
              width={22}
              height={22}
              className="rounded-full"
            />

            <p className="paragraph-semibold text-dark300_light700">
              {author.username}
            </p>
          </Link>
          <Votes
            type="question"
            itemId={JSON.stringify(result._id)}
            userId={JSON.stringify(mongoUser._id)}
            upvotes={result.upvotes.length}
            hasupVoted={result.upvotes.includes(mongoUser._id)}
            downvotes={result.downvotes.length}
            hasdownVoted={result.downvotes.includes(mongoUser._id)}
            hasSaved={mongoUser?.saved.includes(result._id)}
          />
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(result.createdAt)} ago`}
          title="Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(result.answers.length)}
          title="Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(result.views)}
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={result.content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag: { _id: number; name: string }) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={result._id}
        userId={JSON.stringify(mongoUser._id)}
        totalAnswers={result.answers.length}
      />

      <Answer
        question={result.content}
        questionId={result._id}
        authorId={JSON.stringify(mongoUser._id)}
      />
    </>
  );
};

export default page;
