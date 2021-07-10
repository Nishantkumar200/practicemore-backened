import { questionModel } from "../Schema/questionSchema.js";

export const getQuestionDetail = async (req, res) => {
  const questionId = req.params.id;
  //console.log(questionId);

  try {
    const getOneQuestionDetail = await questionModel.findById({_id:questionId});

    if (getOneQuestionDetail) {
      res.send({
        
        question:getOneQuestionDetail.question,
        hints:getOneQuestionDetail.hints,
        answer:getOneQuestionDetail.answer
      });
    }else{
      res.status(500).send({
        message:"Error while fetching question"})
    }
  } catch (error) {
    console.log(error);
  }
};


// For posting question
export const postOneQuestionDetail = async (req, res) => {
  const { question, hints, answer, language } = req.body;

  try {
    const postNewQuestion = new questionModel({
      question,
      hints,
      answer,
      language,
    });

    const postedNewQuestion = await postNewQuestion.save();

    if (postedNewQuestion) {
      res.status(200).json(postNewQuestion);
    } else {
      res.status(400).json({ message: "Error while posting new Question" });
    }
  } catch (error) {
    console.log(error);
  }
};
