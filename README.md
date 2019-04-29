# COL-Submit-App
Colorectal Cancer Screening Submission Reference App

## Building Releases
A Dockerfile is included for customization to easily distribute complete application images. For example:

    docker build -t hspc/davinci-col-submit:latest .
    docker run -it --name davinci-col-submit --rm -p 9090:9090 hspc/davinci-col-submit:latest