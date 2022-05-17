import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-upload-form",
    templateUrl: "./upload-form.component.html",
    styleUrls: ["./upload-form.component.scss"],
})
export class UploadFormComponent implements OnInit {
    constructor() {
    }

    ngOnInit(): void {
    }

    public showFiles(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        let fileList: FileList | null = element.files;
        if (fileList) {
            console.log("FileUpload -> files", fileList);
        }
    }

    public async sendFile(event: Event) {
        const element = document.getElementById("file-upload") as HTMLInputElement;
        let files = element.files as FileList;
        let formData = new FormData();
        for (let index = 0; index < files.length; index++) {
            formData.append("files", files[index]);
        }
        console.log("Sending");
        const result = await fetch("http://localhost:8080/files", { method: "POST", body: formData });
        console.log(result);
    }
}
