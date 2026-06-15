modules/ticket/
├── 1-domain/
│   ├── entities/
│   │   └── ticket.entity.ts
│   ├── value-objects/
│   │   └── [VO].vo.ts
│   └── ports-out/
│       └── ticket.repository.port.ts
├── 2-aplication/
│   ├── use-cases/
│   │   └── create-ticket.use-case.ts
│   ├── dtos/
│   │   └── create-ticket.dto.ts
│   └── ports-in/
│       └── create-ticket.use-case.port.ts  
└── 3-infrastructure/
    └── presentation/
        └── next/
            ├── components/
            │   ├── tickets-layout.tsx
            │   ├── ticket.index.page.tsx
            │   └── ticket.list.page.tsx
            └── view-models-coordinator/
                ├── ticket.index.view-model.tsx
                ├── ticket.list.view.tsx
                └── ticket.coordinator.ts