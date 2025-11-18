import '../../core/convolver-player-core/vitest.shared-mocks'; // Import shared mocks
import '@testing-library/jest-dom';

// Re-export mock classes for direct import in test files
export {
  MockAudioContext,
  MockAudioBufferSourceNode,
  MockConvolverNode,
  MockGainNode,
} from '../../core/convolver-player-core/vitest.shared-mocks';

// Any React-specific mocks (for @convolver-player/core or global APIs)
// will be added here incrementally if tests fail due to their absence.
// For now, we start with a minimal setup.
