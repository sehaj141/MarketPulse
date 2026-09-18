# Engineering Trade-Offs & Key Architecture Decisions Matrix

| Decision | Selection | Rationale & Trade-Off Analysis |
|---|---|---|
| **AI Query Model** | JSON Query DSL AST Compiler | **Security Priority**: Direct SQL generation by LLMs poses massive SQL injection risks. Compiling natural language to a strictly validated JSON AST guarantees zero SQL injection surface. |
| **Real-time Pipeline** | Redis Pub/Sub + WebSockets | Low-latency tick propagation (1.5s interval) without HTTP polling overhead. Decouples market tick generation from API server workers. |
| **State Management** | Zustand | Lightweight client state for market ticks, auth tokens, command palette, and active theme without Redux boilerplate. |
| **Quant Engine** | Next-Day Open Execution | **Zero Look-Ahead Bias**: Signals generated at close are executed on next-day open to reflect real-world execution friction and transaction fees. |
| **Database ORM** | Prisma + Dual Storage | Allows seamless local dev with SQLite and scalable production containerization with PostgreSQL. |
