### 27.6.1 Compilando programas com o libmysqld

Em distribuições binárias pré-compiladas do MySQL que incluem o `libmysqld`, a biblioteca do servidor integrada, o MySQL compila a biblioteca usando o compilador do fornecedor apropriado, se houver um.

Para obter a biblioteca `libmysqld` se você construir o MySQL a partir do código-fonte, você deve configurar o MySQL com a opção `-DWITH_EMBEDDED_SERVER=1`. Veja Seção 2.8.7, “Opções de Configuração de Código-Fonte do MySQL”.

Quando você vincula seu programa com o `libmysqld`, também deve incluir as bibliotecas específicas do sistema `pthread` e algumas bibliotecas que o servidor MySQL usa. Você pode obter a lista completa das bibliotecas executando **mysql\_config --libmysqld-libs**.

As flags corretas para compilar e vincular um programa com suporte a múltiplas threads devem ser usadas, mesmo que você não invocasse diretamente nenhuma função de thread em seu código.

Para compilar um programa C que inclua os arquivos necessários para incorporar a biblioteca do servidor MySQL em uma versão executável de um programa, o compilador precisa saber onde encontrar vários arquivos e precisa de instruções sobre como compilar o programa. O exemplo a seguir mostra como um programa pode ser compilado a partir da linha de comando, assumindo que você está usando o **gcc**, use o compilador C GNU:

```sql
gcc mysql_test.c -o mysql_test \
`/usr/local/mysql/bin/mysql_config --include --libmysqld-libs`
```

Imediatamente após o comando **gcc** está o nome do arquivo de código-fonte do programa C. Depois disso, a opção `-o` é dada para indicar que o nome do arquivo que segue é o nome que o compilador deve dar ao arquivo de saída, o programa compilado. A próxima linha de código instrui o compilador a obter a localização dos arquivos de inclusão e bibliotecas e outras configurações para o sistema em que ele é compilado. O comando **mysql\_config** está contido entre aspas duplas, não aspas simples.

Em algumas plataformas que não são do **gcc**, a biblioteca embutida depende das bibliotecas do tempo de execução do C++, e a vinculação contra a biblioteca embutida pode resultar em erros de símbolo ausente. Para resolver isso, vincule usando um compilador de C++ ou liste explicitamente as bibliotecas necessárias na linha de comando de vinculação.
