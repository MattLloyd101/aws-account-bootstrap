import * as aws from "@pulumi/aws";
import {AccessKey, User, UserPolicy} from "@pulumi/aws/iam";

export class BasicAccessKeyUser {
    name: string;
    user: User;
    accessKey: AccessKey;
    userPolicy: UserPolicy;

    constructor(name: string, userPolicy: object, project: string, path: string = "/") {
        this.name = name;
        this.user = new aws.iam.User(this.name, {
            path,
            tags: {
                project
            }
        });
        this.accessKey = new aws.iam.AccessKey(`${name}AccessKey`, {user: this.user.name});
        this.userPolicy = new aws.iam.UserPolicy(`${name}UserPolicy`, {
            user: this.user.name,
            policy: JSON.stringify(userPolicy),
        });
    }
}
