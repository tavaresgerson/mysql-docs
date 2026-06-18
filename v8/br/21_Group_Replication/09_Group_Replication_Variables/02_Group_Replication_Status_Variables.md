### 20.9.2 Variáveis de Status de Replicação em Grupo

O MySQL 8.0 suporta uma variável de status que fornece informações sobre a replicação por grupo. Essa variável é descrita aqui:

- `group_replication_primary_member`

  Mostra o UUID do membro principal quando o grupo está em modo de único principal. Se o grupo estiver em modo de múltiplos principais, essa será uma string vazia.

  Aviso

  A variável de status `group_replication_primary_member` foi descontinuada e está prevista para ser removida em uma versão futura.

  Veja a Seção 20.1.3.1.2, “Encontrando o Primário”.
