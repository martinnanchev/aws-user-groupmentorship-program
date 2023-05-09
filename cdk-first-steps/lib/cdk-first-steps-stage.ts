import {pipelines, Stage, StageProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {CdkFirstStepsStack} from "./cdk-first-steps-stack";
import {Repository} from "aws-cdk-lib/aws-ecr";
import {Artifact} from "aws-cdk-lib/aws-codepipeline";

export class CdkFirstStepsStage extends Stage {

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    new CdkFirstStepsStack(this, "deploymentStack", props)
  }
}