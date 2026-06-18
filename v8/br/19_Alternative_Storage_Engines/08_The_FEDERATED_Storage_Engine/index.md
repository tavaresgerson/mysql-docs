## 18.8. O Motor de Armazenamento FEDERATED

18.8.1 Visão geral do mecanismo de armazenamento FEDERATED

18.8.2 Como criar tabelas FEDERATED

18.8.3 Notas e dicas do mecanismo de armazenamento FEDERATED

18.8.4 Recursos do Motor de Armazenamento FEDERATED

O mecanismo de armazenamento `FEDERATED` permite que você acesse dados de um banco de dados MySQL remoto sem usar replicação ou tecnologia de cluster. A consulta a uma tabela local `FEDERATED` extrai automaticamente os dados das tabelas remotas (federadas). Nenhum dado é armazenado nas tabelas locais.

Para incluir o mecanismo de armazenamento `FEDERATED` se você construir o MySQL a partir do código-fonte, invocando o **CMake** com a opção `-DWITH_FEDERATED_STORAGE_ENGINE`.

O mecanismo de armazenamento `FEDERATED` não está habilitado por padrão no servidor em execução; para habilitar `FEDERATED`, você deve iniciar o binário do servidor MySQL usando a opção `--federated`.

Para examinar a fonte do motor `FEDERATED`, procure no diretório `storage/federated` de uma distribuição de fonte MySQL.
