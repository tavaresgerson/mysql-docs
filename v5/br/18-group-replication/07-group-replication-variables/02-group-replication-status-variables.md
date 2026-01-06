### 17.7.2 Variáveis de Status de Replicação em Grupo

O MySQL 5.7 suporta uma variável de status que fornece informações sobre a replicação por grupo. Essa variável é descrita aqui:

- `grupo_replicação_membro_primario`

  Mostra o UUID do membro primário quando o grupo está em modo de único primário. Se o grupo estiver em modo de múltiplos primários, mostrará uma string vazia. Consulte Seção 17.5.1.3, “Encontrar o Primário”.
