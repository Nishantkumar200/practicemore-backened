
import request from "request";
export const executeCode = async (req, res) => {
  const { code, language, input } = req.body;

  console.log(code, language, input);

  var program = {
    script: code,
    language: language,
    stdin: input,
    versionIndex: "0",
    clientId: "92fe0c6c6912186bb221b38212c82989",
    clientSecret:
      "72af1b477b11108be70813d8def9efd447e8538285956e056d5473dd67343a86",
  };
  request(
    {
      url: "https://api.jdoodle.com/v1/execute",
      method: "POST",
      json: program,
    },
    function (error, response, body) {
      console.log("error:", error);
      console.log("statusCode:", response && response.statusCode);
      console.log("body:", body);
      res.status(200).json(response);
    }
  );
};
