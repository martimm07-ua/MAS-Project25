# MAS Project 25 - Usit

## Descrição do projeto

O projeto representa uma plataforma de aluguer P2P de equipamentos, como ferramentas, eletrónicos, objetos de casa, material de eventos, fotografia e desporto.

A ideia principal é permitir a partilha de objetos entre pessoas. Um proprietário publica equipamentos parados e um locatário pesquisa, reserva, paga e acompanha o aluguer através da plataforma.

Este incremento implementa uma versão funcional da interface, sem backend. A aplicação foi construída com HTML, CSS e JavaScript, usando o armazenamento do browser para guardar dados durante a interação com o site.

## Objetivo do incremento

Este incremento demonstra os fluxos principais da Usit:

- Login de diferentes perfis
- Pesquisa de equipamentos
- Consulta de detalhes de anúncios
- Contacto com o proprietário
- Pedido de aluguer
- Pagamento simulado
- Confirmação de receção
- Gestão de itens publicados
- Edição de anúncios
- Dashboard de administrador
- Dashboard de parceiro comercial
- Consulta de faturação e dados agregados

## Credenciais de teste

### Utilizador comum, locatário

Email:

```text
rui@usit.pt
```

Palavra-passe:

```text
usit123
```

### Utilizador comum, proprietário

Email:

```text
carla@usit.pt
```

Palavra-passe:

```text
usit123
```

### Administrador

Email:

```text
admin@usit.pt
```

Palavra-passe:

```text
admin123
```

### Parceiro comercial

Email:

```text
parceiro@usit.pt
```

Palavra-passe:

```text
parceiro123
```

## Estrutura do projeto

```text
/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## Responsividade

A aplicação foi pensada para funcionar em ecrãs desktop e em ecrãs mais pequenos.

A interface do site adapta-se a dimensões próximas de telemóvel.

## Mehlorias futuras

Próximos passos possíveis:

- Implementar backend
- Ligar a uma base de dados real
- Implementar autenticação segura
- Integrar serviço real de pagamentos
- Integrar notificações
- Melhorar validação de identidade
- Automatizar testes de aceitação
- Completar fluxo de danos, caução e disputa
