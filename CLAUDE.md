# CLAUDE.md - AI Assistant Guide for Meetup Winner Picker

## Project Overview

**Meetup Winner Picker** is a tool designed to randomly select winners from participants registered on a Meetup event page.

### Project Status
- **Stage**: Early Development (initialized)
- **Current State**: Repository contains LICENSE (MIT) and basic README
- **Language**: French (primary), with potential for internationalization
- **License**: MIT License (Copyright 2025 mdesnouveaux)

### Core Features (Planned)
1. Automatic extraction of participant lists from Meetup events
2. Random selection of one or multiple winners
3. Simple interface or CLI script
4. Fair and transparent selection process

## Repository Structure

```
meetup-winner-picker/
├── README.md           # Project documentation (French)
├── LICENSE             # MIT License
└── CLAUDE.md          # This file - AI assistant guide
```

### Expected Future Structure
```
meetup-winner-picker/
├── src/                # Source code
│   ├── api/           # Meetup API integration
│   ├── picker/        # Random selection logic
│   ├── cli/           # Command-line interface
│   └── ui/            # Optional web interface
├── tests/             # Test suite
├── docs/              # Additional documentation
├── examples/          # Usage examples
├── package.json       # Node.js dependencies (if applicable)
├── requirements.txt   # Python dependencies (if applicable)
├── README.md
├── LICENSE
└── CLAUDE.md
```

## Development Guidelines

### Technology Stack Considerations

**Not Yet Decided** - When implementing, consider:

**Option 1: Node.js/TypeScript**
- Good Meetup API support
- Easy CLI creation with Commander.js or Yargs
- Rich ecosystem for web scraping (Puppeteer, Playwright)
- TypeScript for type safety

**Option 2: Python**
- Excellent for scripting
- Strong data processing libraries
- Good API client libraries (requests, httpx)
- Click or Typer for CLI

**Option 3: Go**
- Fast, single-binary distribution
- Good for CLI tools (Cobra)
- Strong typing and concurrency support

### Code Conventions

#### General Principles
1. **Simplicity First**: This is a straightforward tool - avoid over-engineering
2. **Transparency**: Winner selection must be auditable and fair
3. **Error Handling**: Gracefully handle API failures, network issues
4. **Documentation**: Code should be well-commented, especially the random selection logic
5. **Security**: Handle API keys/tokens securely, never commit credentials

#### Language and Localization
- Primary documentation: French
- Code comments: French or English (be consistent)
- Variable/function names: English (industry standard)
- User-facing messages: French with i18n support for future translations

#### Naming Conventions
- **Functions/Methods**: Descriptive, verb-based (e.g., `selectRandomWinner`, `fetchParticipants`)
- **Variables**: Clear, descriptive names (avoid abbreviations)
- **Constants**: UPPER_SNAKE_CASE for configuration values
- **Files**: kebab-case for file names

### Git Workflow

#### Branch Naming
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`
- AI-assisted branches: `claude/claude-md-*` (current pattern)

#### Commit Messages
- Use clear, descriptive commit messages
- Prefer French or English consistently
- Format: `<type>: <description>`
  - Types: feat, fix, docs, test, refactor, chore
  - Example: `feat: ajout de l'extraction des participants Meetup`
  - Example: `fix: correction du tirage aléatoire avec doublons`

#### Development Process
1. Create feature branch from main
2. Implement feature with tests
3. Ensure all tests pass
4. Update documentation
5. Commit with clear messages
6. Push to remote branch
7. Create pull request (when ready for review)

### API Integration Guidelines

#### Meetup API Considerations
1. **Authentication**: Use OAuth 2.0 or API keys securely
2. **Rate Limiting**: Respect Meetup API rate limits
3. **Error Handling**: Handle 404 (event not found), 401 (unauthorized), 429 (rate limited)
4. **Data Privacy**: Handle participant data responsibly, respect GDPR
5. **Caching**: Consider caching participant lists to reduce API calls

#### Fallback Options
If Meetup API is restrictive:
- Web scraping as fallback (with proper error handling)
- Manual CSV import option
- Support for other event platforms (Eventbrite, etc.)

### Random Selection Implementation

#### Critical Requirements
1. **Cryptographically Secure**: Use secure random number generators
   - Node.js: `crypto.randomInt()`
   - Python: `secrets.SystemRandom()`
   - Go: `crypto/rand`
2. **Reproducibility**: Optionally support seeded random for verification
3. **Fairness**: Each participant has equal probability
4. **No Duplicates**: Unless explicitly requested
5. **Auditability**: Log selection process (timestamp, seed if used, total participants)

#### Algorithm Recommendations
- Fisher-Yates shuffle for multiple winners
- Cryptographically secure random index selection for single winner
- Document the exact algorithm used for transparency

### Testing Strategy

#### Test Coverage Requirements
1. **Unit Tests**: Core random selection logic
2. **Integration Tests**: API integration with Meetup
3. **E2E Tests**: Full workflow from fetch to winner selection
4. **Edge Cases**:
   - Empty participant list
   - Single participant
   - Requesting more winners than participants
   - API failures and timeouts
   - Invalid event URLs/IDs

#### Testing Frameworks
- Node.js: Jest or Vitest
- Python: pytest
- Go: built-in testing package

### CLI Interface Design

#### Command Structure
```bash
meetup-picker <event-url> [options]

Options:
  -n, --number <count>    Number of winners to select (default: 1)
  -o, --output <file>     Save results to file
  -s, --seed <value>      Use specific seed for reproducibility
  -v, --verbose           Show detailed output
  --exclude <names>       Exclude specific participants
  --format <json|text>    Output format
```

#### User Experience
- Clear progress indicators for API calls
- Informative error messages in French
- Confirmation before final selection
- Display total participants and winner(s) clearly

### Security Considerations

#### API Keys and Credentials
1. **Never commit credentials**: Use environment variables or config files
2. **Use .gitignore**: Ignore `.env`, `config.local.*`, `credentials.*`
3. **Document setup**: Provide `.env.example` file
4. **Secure storage**: Use system keychain when possible

#### Data Handling
1. **Minimize data collection**: Only fetch necessary participant information
2. **No persistent storage**: Don't store participant data unless necessary
3. **Respect privacy**: Handle names and contact info responsibly
4. **GDPR compliance**: Provide data handling documentation

### Documentation Standards

#### Code Documentation
- Document all public APIs and functions
- Explain complex algorithms (especially random selection)
- Include usage examples in docstrings
- Keep comments up-to-date with code changes

#### README Requirements
- Installation instructions
- Quick start guide
- Configuration options
- Usage examples
- Troubleshooting section
- Contributing guidelines
- License information

#### Additional Documentation
- API integration guide
- Architecture decision records (ADRs) for major decisions
- Changelog for version tracking

### Error Handling Patterns

#### User-Facing Errors
```
❌ Erreur: Impossible de récupérer les participants
   → Vérifiez que l'URL de l'événement est valide
   → Assurez-vous que votre token API est configuré
   → L'événement doit être public ou vous devez avoir accès
```

#### Logging
- Use structured logging (JSON format for production)
- Log levels: DEBUG, INFO, WARN, ERROR
- Include context: timestamp, operation, event ID
- Never log sensitive data (API keys, personal info)

### Performance Considerations

1. **API Calls**: Minimize unnecessary requests
2. **Caching**: Cache participant lists for short duration
3. **Async/Parallel**: Use async operations for API calls
4. **Memory**: Handle large participant lists efficiently
5. **Startup Time**: CLI should start quickly

### Future Enhancements (Optional)

Consider these features for future versions:
- Web interface for non-technical users
- Export winner history
- Multi-platform event support (Eventbrite, etc.)
- Email notification to winners
- Social media sharing integration
- Weighted random selection (based on participation history)
- Blacklist/whitelist functionality
- Multiple selection rounds
- Live drawing visualization

## AI Assistant Specific Guidelines

### When Contributing to This Project

1. **Understand the Context**: This is a tool for fair, transparent winner selection
2. **Prioritize Fairness**: Random selection must be truly random and auditable
3. **Keep It Simple**: Don't over-engineer - this is a focused tool
4. **Security First**: Handle API credentials and user data responsibly
5. **Test Thoroughly**: Especially the random selection logic
6. **Document Everything**: Help future contributors understand your decisions

### Before Implementing Features

1. **Check existing code**: Understand what's already implemented
2. **Read the README**: Understand current project state
3. **Consider alternatives**: Propose multiple approaches for complex features
4. **Ask for clarification**: If requirements are ambiguous
5. **Plan before coding**: Outline approach for complex changes

### Code Review Checklist

Before committing code, verify:
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Error handling implemented
- [ ] No credentials committed
- [ ] Code follows project conventions
- [ ] Comments explain "why" not just "what"
- [ ] API rate limits respected
- [ ] Edge cases handled
- [ ] User-facing messages in French
- [ ] Performance acceptable

### Common Pitfalls to Avoid

1. ❌ Using `Math.random()` for winner selection (not cryptographically secure)
2. ❌ Hardcoding API keys in source code
3. ❌ Not handling API rate limits
4. ❌ Forgetting to handle empty participant lists
5. ❌ Not validating event URLs/IDs
6. ❌ Over-complicating the random selection logic
7. ❌ Not providing clear error messages to users
8. ❌ Storing participant data unnecessarily
9. ❌ Not testing with real Meetup API responses
10. ❌ Ignoring edge cases (1 participant, 0 participants)

## Quick Start for AI Assistants

### Initial Setup Tasks
1. Choose technology stack (Node.js/Python/Go)
2. Set up project structure
3. Configure package manager and dependencies
4. Create `.gitignore` for credentials and build artifacts
5. Set up testing framework
6. Create `.env.example` for API configuration

### First Feature to Implement
1. Meetup API authentication and setup
2. Fetch participant list from event
3. Basic random selection (single winner)
4. CLI interface to tie it together
5. Tests for all components

### Testing the Tool
```bash
# Example workflow
1. Get Meetup API credentials
2. Configure environment variables
3. Run tool with test event
4. Verify winner selection is random and fair
5. Test error cases (invalid URL, network failure)
```

## Resources and References

### Meetup API
- Meetup API Documentation: https://www.meetup.com/api/
- OAuth 2.0 Guide: https://www.meetup.com/api/authentication/
- Rate Limits: Check current Meetup API documentation

### Random Selection References
- Fisher-Yates Shuffle Algorithm
- Cryptographically Secure Random Number Generation
- Statistical fairness testing

### Related Projects
Look for similar tools for inspiration:
- Raffle/lottery selection tools
- Event management utilities
- Meetup API client libraries

## Contact and Contributions

- **Owner**: mdesnouveaux
- **License**: MIT
- **Language**: French (primary)
- **Status**: Open for contributions

When in doubt, prioritize fairness, transparency, and simplicity.

---

**Last Updated**: 2025-11-14
**Document Version**: 1.0.0
