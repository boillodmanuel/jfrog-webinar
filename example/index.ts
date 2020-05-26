import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const dockerWebApp = new DockerWebApp("platycorp-app", "./app")

export let frontendURL = dockerWebApp.frontendUrl;
