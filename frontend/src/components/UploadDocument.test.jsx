import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, test } from "vitest";
import UploadDocument from "./UploadDocument";

describe("UploadDocument", () => {

    // Checks that upload is disabled when no PDF is selected
    test("disables upload button when no file is selected", () => {

        render(
            <UploadDocument
                file={null}
                setFile={() => { }}
                handleUpload={() => { }}
                isUploading={false}
                uploadMessage=""
            />
        );

        const uploadButton = screen.getByRole("button", {
            name: "Upload PDF",
        });

        expect(uploadButton).toBeDisabled();
    });

});