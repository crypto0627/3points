"use client";

import {
  MiniKit,
  VerificationLevel,
  ISuccessResult,
  MiniAppVerifyActionErrorPayload,
  IVerifyResponse,
} from "@worldcoin/minikit-js";
import { useCallback, useState } from "react";

const verifyPayload = {
  action: "hello-world",
  signal: "",
  verification_level: VerificationLevel.Orb,
};

export const VerifyBlock = () => {
  const [handleVerifyResponse, setHandleVerifyResponse] = useState<
    MiniAppVerifyActionErrorPayload | IVerifyResponse | null
  >(null);

  const handleVerify = useCallback(async () => {
    if (!MiniKit.isInstalled()) {
      console.warn("MiniKit 未安裝");
      return null;
    }

    const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

    if (finalPayload.status === "error") {
      console.error("驗證錯誤", finalPayload);
      setHandleVerifyResponse(finalPayload);
      return;
    }

    const verifyResponse = await fetch(`/api/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payload: finalPayload as ISuccessResult,
        action: verifyPayload.action,
        signal: verifyPayload.signal,
      }),
    });

    const verifyResponseJson = await verifyResponse.json();

    if (verifyResponseJson.code === "success") {
      console.log("驗證成功！", finalPayload);
    }

    setHandleVerifyResponse(verifyResponseJson);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold">World ID 驗證</h2>
      <button
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
        onClick={handleVerify}
      >
        進行驗證
      </button>
      <pre className="mt-4 text-sm text-gray-400">
        {JSON.stringify(handleVerifyResponse, null, 2)}
      </pre>
    </div>
  );
};
