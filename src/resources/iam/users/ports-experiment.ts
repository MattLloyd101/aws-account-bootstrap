import * as pulumi from "@pulumi/pulumi";

import {definition as PORTS_EXPERIMENT} from "../../../projects/ports-experiment";
import {BasicAccessKeyUser} from "./BasicAccessKeyUser";

export function initUser() {
    const policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": [
                    "ec2:Describe*"
                ],
                "Effect": "Allow",
                "Resource": "*"
            }
        ]
    };

    const userName = PORTS_EXPERIMENT.projectName
    const user = new BasicAccessKeyUser(userName, policy, PORTS_EXPERIMENT.projectName);

    pulumi.all([user.accessKey.id, user.accessKey.secret]).apply(([id, secret]) => {
        console.log("===");
        console.log(`Credentials for ${userName}:`);
        console.log(`Access Key ID: ${id}`);
        console.log(`Secret Access Key: ${secret}`);
        console.log("===");
    });

    return user;
}