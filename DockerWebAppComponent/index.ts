import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

export class DockerWebApp extends pulumi.ComponentResource {
    readonly frontendUrl: pulumi.Output<string>;
    constructor(name: string, path: string) {
        
        const componentType = "platycorp:aws:DockerWebApp";
        super(componentType, name);

        const listener = new awsx.elasticloadbalancingv2.NetworkListener(`${name}-nginx`, { port: 80 }, { parent: this });

        // Define the service to run.  We pass in the listener to hook up the network load balancer
        // to the containers the service will launch.
        const service = new awsx.ecs.FargateService(`${name}-nginx`, {
            desiredCount: 2,
            taskDefinitionArgs: {
                containers: {
                    nginx: {
                        image: awsx.ecs.Image.fromPath(`${name}-nginx`, path),
                        memory: 512,
                        portMappings: [listener],
                    },
                },
            },
        }, { parent: this });

        this.frontendUrl = pulumi.interpolate `http://${listener.endpoint.hostname}/`;

        this.registerOutputs({
            frontendUrl: this.frontendUrl
        });
    }
}
