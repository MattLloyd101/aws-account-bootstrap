export const pulumiAssumeRolePolicy = {
    Version: "2012-10-17",
    Statement: [{
        Action: "sts:AssumeRole",
        Effect: "Allow",
        Sid: "",
        Principal: {
            Service: "iam.amazonaws.com",
        },
    }],
}