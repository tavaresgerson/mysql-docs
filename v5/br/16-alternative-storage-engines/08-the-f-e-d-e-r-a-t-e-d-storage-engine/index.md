## 15.8 O Storage Engine FEDERATED

15.8.1 Visão Geral do Storage Engine FEDERATED

15.8.2 Como Criar Tabelas FEDERATED

15.8.3 Notas e Dicas sobre o Storage Engine FEDERATED

15.8.4 Recursos do Storage Engine FEDERATED

O storage engine `FEDERATED` permite que você acesse dados de um MySQL Database remoto sem usar replicação ou tecnologia de cluster. Realizar uma Query em uma tabela `FEDERATED` local puxa automaticamente os dados das tabelas remotas (federadas). Nenhum dado é armazenado nas tabelas locais.

Para incluir o storage engine `FEDERATED` caso você compile o MySQL a partir do código fonte, invoque o **CMake** com a opção `-DWITH_FEDERATED_STORAGE_ENGINE`.

O storage engine `FEDERATED` não é habilitado por padrão no servidor em execução; para habilitar `FEDERATED`, você deve iniciar o binário do servidor MySQL usando a opção `--federated`.

Para examinar o código fonte do engine `FEDERATED`, procure no diretório `storage/federated` de uma distribuição do código fonte do MySQL.