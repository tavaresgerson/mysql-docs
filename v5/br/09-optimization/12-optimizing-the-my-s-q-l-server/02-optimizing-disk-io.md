### 8.12.2 Otimização do I/O de disco

Esta seção descreve as maneiras de configurar dispositivos de armazenamento quando você pode dedicar mais e um hardware de armazenamento mais rápido ao servidor de banco de dados. Para obter informações sobre como otimizar uma configuração do `InnoDB` para melhorar o desempenho de E/S, consulte a Seção 8.5.8, “Otimizando o E/S de Disco do InnoDB”.

- As buscas em disco são um grande gargalo de desempenho. Esse problema se torna mais evidente quando a quantidade de dados começa a crescer tanto que o cache efetivo se torna impossível. Para grandes bancos de dados onde você acessa os dados de forma mais ou menos aleatória, você pode ter certeza de que precisa de pelo menos uma busca em disco para ler e algumas buscas em disco para escrever. Para minimizar esse problema, use discos com tempos de busca baixos.

- Aumente o número de eixos de disco disponíveis (e, consequentemente, reduza o overhead de busca) ao vincular os arquivos a diferentes discos ou ao estender os discos:

  - Usando links simbólicos

    Isso significa que, para as tabelas `MyISAM`, você cria um symlink para o arquivo de índice e os arquivos de dados de sua localização usual no diretório de dados para outro disco (que também pode ser estendido). Isso melhora tanto os tempos de busca quanto de leitura, assumindo que o disco não esteja sendo usado para outros fins também. Veja a Seção 8.12.3, “Usando Links Simbólicos”.

    Os links simbólicos não são suportados para uso com tabelas `InnoDB`. No entanto, é possível colocar os arquivos de dados e log do `InnoDB` em discos físicos diferentes. Para obter mais informações, consulte a Seção 8.5.8, “Otimizando o I/O de disco do InnoDB”.

  - Stripação

    A faixa significa que você tem muitos discos e coloca o primeiro bloco no primeiro disco, o segundo bloco no segundo disco e o `N`-ésimo bloco no disco (`N MOD número_de_discos`), e assim por diante. Isso significa que, se o tamanho normal dos seus dados for menor que o tamanho da faixa (ou perfeitamente alinhado), você obterá um desempenho muito melhor. A faixa depende muito do sistema operacional e do tamanho da faixa, então faça uma medição de desempenho com diferentes tamanhos de faixa. Veja a Seção 8.13.2, “Usando seus próprios benchmarks”.

    A diferença de velocidade para striping é *muito* dependente dos parâmetros. Dependendo da forma como você define os parâmetros de striping e o número de discos, você pode obter diferenças medidas em ordens de grandeza. Você precisa escolher se deseja otimizar para acesso aleatório ou sequencial.

- Para confiabilidade, você pode querer usar RAID 0+1 (stripping mais espelhamento), mas, nesse caso, você precisa de 2 × *`N`* unidades para armazenar *`N`* unidades de dados. Essa é provavelmente a melhor opção se você tiver dinheiro para isso. No entanto, você também pode precisar investir em algum software de gerenciamento de volume para lidar com isso de forma eficiente.

- Uma boa opção é variar o nível do RAID de acordo com a importância de cada tipo de dado. Por exemplo, armazene dados semi-importantes que podem ser regenerados em um disco RAID 0, mas armazene dados realmente importantes, como informações do host e logs, em um disco RAID 0+1 ou RAID *`N`*. O RAID *`N`* pode ser um problema se você tiver muitas escritas, devido ao tempo necessário para atualizar os bits de paridade.

- Você também pode definir os parâmetros do sistema de arquivos que o banco de dados utiliza:

  Se você não precisa saber quando os arquivos foram acessados pela última vez (o que não é realmente útil em um servidor de banco de dados), você pode montar seus sistemas de arquivos com a opção `-o noatime`. Isso ignora as atualizações do último horário de acesso nos inodes do sistema de arquivos, o que evita alguns buscas no disco.

  Em muitos sistemas operacionais, você pode configurar um sistema de arquivos para ser atualizado de forma assíncrona ao montá-lo com a opção `-o async`. Se o seu computador estiver razoavelmente estável, isso deve proporcionar um melhor desempenho sem sacrificar muita confiabilidade. (Essa bandeira está ativada por padrão no Linux.)

#### Usando NFS com MySQL

Você deve ter cautela ao considerar se deve usar o NFS com o MySQL. Problemas potenciais, que variam de acordo com o sistema operacional e a versão do NFS, incluem os seguintes:

- Os arquivos de dados e log do MySQL colocados em volumes NFS ficam bloqueados e indisponíveis para uso. Problemas de bloqueio podem ocorrer quando múltiplas instâncias do MySQL acessam o mesmo diretório de dados ou quando o MySQL é desligado de forma inadequada, devido a uma queda de energia, por exemplo. A versão 4 do NFS resolve problemas de bloqueio subjacentes com a introdução do bloqueio baseado em aconselhamento e arrendamento. No entanto, compartilhar um diretório de dados entre as instâncias do MySQL não é recomendado.

- Inconsistências nos dados introduzidas devido a mensagens recebidas fora de ordem ou tráfego de rede perdido. Para evitar esse problema, use o TCP com as opções de montagem `hard` e `intr`.

- Limitações de tamanho de arquivo máximo. Os clientes da versão 2 do NFS só podem acessar os primeiros 2 GB de um arquivo (deslocamento de 32 bits assinado). Os clientes da versão 3 do NFS suportam arquivos maiores (até deslocamentos de 64 bits). O tamanho máximo de arquivo suportado também depende do sistema de arquivos local do servidor NFS.

Usar o NFS em um ambiente SAN profissional ou em outro sistema de armazenamento tende a oferecer maior confiabilidade do que usar o NFS fora de um ambiente como esse. No entanto, o NFS em um ambiente SAN pode ser mais lento do que o armazenamento não rotativo conectado diretamente ou por meio de uma barra.

Se você optar por usar o NFS, recomenda-se a versão 4 ou posterior do NFS, além de testar o ambiente NFS antes de implementá-lo em um ambiente de produção.
