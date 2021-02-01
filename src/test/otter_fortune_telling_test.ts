/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *
 */
/* eslint-disable  node/no-unpublished-import */
/* eslint-disable  prefer-arrow-callback */

import 'mocha';
import {ActionsOnGoogleTestManager} from '@assistant/conversation-testing';

const PROJECT_ID = 'otter-fortune-telling-xxxxx';  // '__project_id__'
const TRIGGER_PHRASE =
    'カワウソ食べ物占いにつないで';  //'Talk to __action_trigger_phrase__'

const DEFAULT_LOCALE = 'ja-JP';
const DEFAULT_SURFACE = 'PHONE';

describe('Action project', function () {
  // Set the timeout for each test run to 60s.
  this.timeout(60000);
  let test: ActionsOnGoogleTestManager;

  before('setup test suite', async function() {
    test = new ActionsOnGoogleTestManager({ projectId: PROJECT_ID });
    await test.writePreviewFromDraft();
    test.setSuiteLocale(DEFAULT_LOCALE);
    test.setSuiteSurface(DEFAULT_SURFACE);
  });

  afterEach('clean up test', function () {
    test.cleanUpAfterTest();
  });

  // Happy path test
  it('should match Snack Type, and end the conversation', async function () {
    await test.sendQuery(TRIGGER_PHRASE);
    test.assertSpeech('カワウソたべもの占いへようこそ！ 占ってほしいのはランチ？ディナー？それともおやつ？');
    await test.sendQuery('おやつ');
    test.assertSpeech(`ふむふむ。おやつか〜。\nそんな君におすすめのおやつは.*楽しみだね〜！もう一回やる？`, {isRegexp: true});
    // test.assertSessionParam('chosenOptions', 'snack')
    await test.sendQuery('やらない');
    test.assertSpeech('じゃあまたね！');
    // await test.sendStop();
    test.assertConversationEnded();
  });

  // Again path test
  it('should match Lunch Type, and agin the conversation', async function () {
    await test.sendQuery(TRIGGER_PHRASE);
    test.assertSpeech('カワウソたべもの占いへようこそ！ 占ってほしいのはランチ？ディナー？それともおやつ？');
    await test.sendQuery('ランチ');
    test.assertSpeech(`ふむふむ。ランチか〜。\nそんな君におすすめのランチは.*楽しみだね〜！もう一回やる？`, {isRegexp: true});
    test.assertScene('Again');
    await test.sendQuery('やる');
    test.assertSpeech('占ってほしいのはランチ？ディナー？それともおやつ？');
    test.assertConversationNotEnded();
  });

});
