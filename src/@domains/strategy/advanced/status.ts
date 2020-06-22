export enum STATUS_NAME {
  // architect
  CREATING = 'creating',
  ESTIMATION_BEFORE_ASSIGNING = 'estimation_before_assigning',
  ASSIGNING_RESPONSIBLE = 'assigning_responsible',

  // developer
  ESTIMATION_BEFORE_PERFORMER = 'estimating_before_PERFORMER',
  ASSIGNING_PERFORMER = 'assigning_performer',
  ESTIMATION_BEFORE_TO_DO = 'estimation_before_to_do',
  READY_TO_DO = 'ready_to_do',
  IN_PROGRESS = 'in_progress',
  AUTO_TESTING = 'auto_testing',
  PROF_REVIEW = 'prof_review',

  // tester
  ESTIMATION_BEFORE_TEST = 'estimation_before_test',
  READY_TO_TEST = 'ready_to_test',
  TESTING = 'testing',

  // architect
  ARCHITECT_REVIEW = 'architect_review',

  // developer
  READY_TO_DEPLOY = 'ready_to_deploy',
  DEPLOYING = 'deploying',
  DEPLOYED_PROF_ESTIMATION = 'deployed_prof_estimation',

  // architect
  DEPLOYED_ARCHITECT_ESTIMATION = 'deployed_architect_estimation',

  // community
  DEPLOYED_COMMUNITY_ESTIMATION = 'deployed_community_estimation',
  DEPLOYED_ESTIMATION = 'deployed_estimating',
  DONE = 'done',
}
