import React from "react";
import { CopyBlock, a11yLight } from "react-code-blocks";

export default function ResponseSnippet({responseCode}) {
  let codeText = responseCode

  codeText =responseCode.replaceAll(',', '\n')
  
  return (
    <div className="bg-white w-11/12 md:w-full max-w-6xl min-h-max rounded-lg shadow-sm text-gray-200 mt-8 overflow-y-auto p-4 border-2 border-gray-200" id="div1">   
      <h4 className="text-lg font-semibold text-black">Response</h4>
      <hr />
      <CopyBlock text={codeText} language="json" wrapLines theme={a11yLight} />
    </div>
  );
}

