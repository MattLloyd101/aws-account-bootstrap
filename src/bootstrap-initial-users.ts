import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import {blockAllWithoutMFAPolicy} from "./resources/iam/policies/block-all-without-mfra";
import {pulumiAssumeRolePolicy} from "./resources/iam/policies/pulumi-assume-role-policy";

import {initAllUsers} from "./resources/iam/users";

const config = new pulumi.Config();

// create MFA block policy
const blockAllWithoutMFAPolicyARN = config.requireSecret("blockAllWithoutMFAPolicyARN");

// ARN contains account ID which should be secure and not committed to git.
blockAllWithoutMFAPolicyARN.apply(arn => {
    // create everyone group
    const everyone = new aws.iam.Group("Everyone", {
        name: "Everyone",
        path: "/",
    }, { import: "Everyone" });

    const blockAllWithoutMFA = new aws.iam.Policy("Block-All-Without-MFA", {
        name: "Block-All-Without-MFA",
        path: "/",
        description: "Block access without MFA",
        policy: JSON.stringify(blockAllWithoutMFAPolicy),
    }, { import: arn });

// assign policy to group
    const blockAttachment = new aws.iam.GroupPolicyAttachment("Block-Without-MFA-on-Everyone", {
        group: everyone.name,
        policyArn: blockAllWithoutMFA.arn,
    });

// create PulumiAdmin Role
    const pulumiRole = new aws.iam.Role("PulumiRole", {
        name: "PulumiRole",
        path: "/",
        assumeRolePolicy: JSON.stringify(pulumiAssumeRolePolicy),
        managedPolicyArns: [
            aws.iam.ManagedPolicy.IAMFullAccess
        ]
    }, { import: "PulumiRole" });

    initAllUsers();
});


