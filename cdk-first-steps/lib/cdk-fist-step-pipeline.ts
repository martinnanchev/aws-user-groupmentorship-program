import {pipelines, Stack, Stage, StageProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {CdkFirstStepsStage} from "./cdk-first-steps-stage";
import {Repository} from "aws-cdk-lib/aws-codecommit";
import {CodeBuildStep, CodePipeline, CodePipelineSource} from "aws-cdk-lib/pipelines";
export class CdkFistStepPipeline extends Stack {

    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);
        const pipelineName = "CdkFirstStackOpsPipeline";
        const code_repo = new Repository(this, "CdkFirstPipelineRepo", {
            repositoryName: `${pipelineName}Repo`,
        });

        const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
           pipelineName: 'WorkshopPipeline',
            synth: new CodeBuildStep('SynthStep', {
                    input: CodePipelineSource.codeCommit(code_repo, 'main'),
                    installCommands: [
                        'npm install -g aws-cdk'
                    ],
                    commands: [
                        'npm ci',
                        'npm run build',
                        'npx cdk synth'
                    ]
                }
            )
        });
        pipeline.addStage(new CdkFirstStepsStage(this, 'Prod', {}));
    }
}