import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import {blockAllWithoutMFAPolicy} from "./resources/iam/policies/block-all-without-mfra";
import {pulumiAssumeRolePolicy} from "./resources/iam/policies/pulumi-assume-role-policy";
import {pulumiRolePermissionsPolicy} from "./resources/iam/policies/pulumi-role-permissions-policy";

const config = new pulumi.Config();

// create everyone group
const everyone = new aws.iam.Group("Everyone", {
    name: "Everyone",
    path: "/",
});

// create MFA block policy
const blockAllWithoutMFA = new aws.iam.Policy("Block-All-Without-MFA", {
    name: "Block-All-Without-MFA",
    path: "/",
    description: "Block access without MFA",
    policy: JSON.stringify(blockAllWithoutMFAPolicy),
});

// assign policy to group
const blockAttachment = new aws.iam.GroupPolicyAttachment("Block-Without-MFA-on-Everyone", {
    group: everyone.name,
    policyArn: blockAllWithoutMFA.arn,
});

// Pulumi Policy
const pulumiRolePermissions = new aws.iam.Policy("Pulumi-Role-Permissions", {
    name: "Pulumi-Role-Permissions",
    path: "/",
    description: "Permissions for Pulumi",
    policy: JSON.stringify(pulumiRolePermissionsPolicy),
});

// create PulumiAdmin Role
const pulumiRole = new aws.iam.Role("PulumiRole", {
    name: "PulumiRole",
    path: "/",
    assumeRolePolicy: JSON.stringify(pulumiAssumeRolePolicy),
    managedPolicyArns: [
        aws.iam.ManagedPolicy.IAMFullAccess
    ]
})