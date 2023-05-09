#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkFirstStepsStack } from '../lib/cdk-first-steps-stack';
import {CdkFistStepPipeline} from "../lib/cdk-fist-step-pipeline";

const app = new cdk.App();
new CdkFistStepPipeline(app, "CdkOpsPipeline", {});
