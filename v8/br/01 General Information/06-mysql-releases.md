## 1.3 Lançamentos do MySQL: Inovação e LTS

O modelo de lançamento do MySQL é dividido em duas faixas principais: LTS (Suporte a Longo Prazo) e Inovação.

\*\* Figura 1.1 Calendário de lançamento do MySQL \*\*

![Graph shows the general release cycle starting with MySQL 8.0.0 Bugfix series, and shows short Innovation releases between each long LTS version. Roughly every two years a new LTS series branch begins, including 8.4.x and 9.7.x.](images/mysql-lts-innovation-versioning-graph.png)

### Lançamentos MySQL LTS

- `Audience`: Se o seu ambiente requer um conjunto estável de recursos e um período de suporte mais longo.
- `Behavior`: Esses lançamentos contêm apenas correções necessárias para reduzir os riscos associados a mudanças no comportamento do software de banco de dados. Não há remoções dentro de uma versão LTS. Os recursos podem ser removidos (e adicionados) apenas na primeira versão LTS (como 8.4.0 LTS), mas não mais tarde.
- `Support`: Uma série LTS segue a \[Oracle Lifetime Support] (<https://www.oracle.com/support/lifetime-support/software.html>) Política, que inclui 5 anos de suporte principal e 3 anos de suporte estendido.

### Lançamentos de Inovação MySQL

- `Audience`: Se você quiser acesso aos recursos, melhorias e alterações mais recentes. Esses lançamentos são ideais para desenvolvedores e DBAs que trabalham em ambientes de desenvolvimento de ritmo acelerado com altos níveis de testes automatizados e técnicas modernas de integração contínua para ciclos de atualização mais rápidos.
- `Behavior`: Além de novos recursos em lançamentos de inovação, mudanças de comportamento também são esperadas à medida que o código é refatorado, a funcionalidade desatualizada é removida e quando o MySQL é modificado para se comportar mais de acordo com os padrões SQL. Isso não acontecerá dentro de uma versão LTS.

  As mudanças de comportamento podem ter um grande impacto, especialmente quando se trata de qualquer coisa relacionada a aplicativos, como sintaxe SQL, novas palavras reservadas, execução de consultas e desempenho de consultas.
- `Support`: Os lançamentos de inovação são suportados até o próximo lançamento de inovação.

### Portfólio MySQL

O MySQL Server, o MySQL Shell, o MySQL Router, o MySQL Operator for Kubernetes e o MySQL NDB Cluster têm lançamentos de Inovação e LTS.

O MySQL Connector tem uma versão com o número de versão mais recente, mas permanece compatível com todas as versões suportadas do MySQL Server. Por exemplo, o MySQL Connector/Python 9.0.0 é compatível com o MySQL Server 8.0, 8.4 e 9.0.

### Instalação, atualização e degradação

Ter duas faixas afeta como o MySQL é instalado, atualizado e rebaixado.

Ao usar o repositório oficial do MySQL, a faixa desejada é definida na configuração do repositório. Por exemplo, com o Yum, escolha `mysql-innovation-community` para instalar e atualizar versões da Innovation ou `mysql-8.4-lts-community` para instalar e atualizar versões do MySQL 8.4.x.

- Notas do LTS \*

A funcionalidade permanece a mesma e o formato de dados não muda em uma série LTS, portanto, atualizações e degradações no local são possíveis dentro da série LTS. Por exemplo, o MySQL 8.4.0 pode ser atualizado para uma versão posterior do MySQL 8.4.x.

A atualização para a próxima série LTS é suportada, como 8.4.x LTS para 9.7.x LTS, enquanto pular uma série LTS não é suportada.

\*\* Notas de inovação \*\*

Uma instalação de Inovação segue um comportamento semelhante em que uma versão de Inovação atualiza para uma versão mais recente da série de Inovação.

A principal diferença é que você não pode atualizar diretamente entre uma série de inovação de diferentes versões principais, como 8.3.0 a 9.0.0. Em vez disso, primeiro atualize para a série LTS mais próxima e depois atualize para a próxima série de inovação. Por exemplo, atualizar 8.3.0 para 8.4.0 e depois 8.4.0 para 9.0.0 é um caminho de atualização válido.

Para ajudar a facilitar a transição, o repositório oficial do MySQL trata a primeira versão LTS como LTS e Inovação, por exemplo, com a faixa Inovação ativada em sua configuração de repositório local, o MySQL 8.3.0 atualiza para 8.4.0 e depois para 9.0.0.

O lançamento de inovações requer uma descarga e uma carga lógicas.

**Informações adicionais e exemplos**

Para obter informações adicionais e exemplos específicos de cenários suportados, consulte a Seção 3.2, Caminhos de Atualização ou o Capítulo 4, *Downgrading MySQL*. Eles descrevem as opções disponíveis para executar atualizações no local (que substituem binários com os pacotes mais recentes), um despejo e carga lógicos (como o uso de utilitários de despejo `mysqldump` ou do MySQL Shell), clonagem de dados com o plugin clone e replicação assíncrona para servidores em uma topologia de replicação.
