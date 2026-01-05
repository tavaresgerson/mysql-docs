### 2.10.10 Atualizando o MySQL com pacotes RPM baixados diretamente

É preferível usar o repositório MySQL Yum ou o [repositório MySQL SLES](https://dev.mysql.com/downloads/repo/suse/) para atualizar o MySQL em plataformas baseadas em RPM. No entanto, se você precisar atualizar o MySQL usando os pacotes RPM baixados diretamente da [MySQL Developer Zone](https://dev.mysql.com/), consulte a Seção 2.5.5, “Instalando o MySQL no Linux Usando Pacotes RPM da Oracle” para obter informações sobre os pacotes. Vá para a pasta que contém todos os pacotes baixados (e, de preferência, nenhum outro pacote RPM com nomes semelhantes) e execute o seguinte comando:

```sh
yum install mysql-community-{server,client,common,libs}-*
```

Substitua **yum** por **zypper** para sistemas SLES e por **dnf** para sistemas com suporte ao dnf.

Embora seja muito preferível usar uma ferramenta de gerenciamento de pacotes de alto nível, como o **yum**, para instalar os pacotes, os usuários que preferiam comandos diretos do **rpm** podem substituir o comando **yum install** pelo comando **rpm -Uvh**. No entanto, usar **rpm -Uvh** torna o processo de instalação mais propenso a falhas, devido a possíveis problemas de dependência que o processo de instalação possa encontrar.

Para uma instalação de atualização usando pacotes RPM, o servidor MySQL é reiniciado automaticamente no final da instalação se ele estivesse em execução quando a instalação de atualização começou. Se o servidor não estivesse em execução quando a instalação de atualização começou, você precisa reiniciar o servidor manualmente após a instalação de atualização ser concluída; faça isso com, por exemplo, o comando a seguir:

```sql
service mysqld start
```

Depois que o servidor for reiniciado, execute o **mysql_upgrade** para verificar e, se necessário, resolver quaisquer incompatibilidades entre os dados antigos e o software atualizado. O **mysql_upgrade** também executa outras funções; consulte a Seção 4.4.7, “mysql_upgrade — Verificar e Atualizar Tabelas do MySQL”, para obter detalhes.

Nota

Devido às relações de dependência entre os pacotes RPM, todos os pacotes instalados devem ter a mesma versão. Portanto, sempre atualize todos os pacotes instalados para o MySQL. Por exemplo, não atualize apenas o servidor sem também atualizar o cliente, os arquivos comuns para as bibliotecas do servidor e do cliente, e assim por diante.

**Migração e Atualização a partir de instalações por pacotes RPM mais antigos.** Algumas versões mais antigas dos pacotes RPM do MySQL Server têm nomes na forma MySQL-\* (por exemplo, MySQL-server-\* e MySQL-client-\*). As versões mais recentes dos RPMs, quando instaladas usando a ferramenta padrão de gerenciamento de pacotes (**yum**, **dnf** ou **zypper**), atualizam essas instalações mais antigas de forma transparente, tornando desnecessário desinstalar esses pacotes antigos antes de instalar os novos. Aqui estão algumas diferenças de comportamento entre os pacotes RPM mais antigos e os atuais:

**Tabela 2.16 Diferenças entre os pacotes RPM anteriores e atuais para instalação do MySQL**

<table>
   <thead>
      <tr>
         <th>Característica</th>
         <th>Comportamento de pacotes anteriores</th>
         <th>Comportamento dos Pacotes Atuais</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th>O serviço começa após a instalação estar concluída</th>
         <td>Sim</td>
         <td>Não, a menos que seja uma instalação de atualização e o servidor estivesse em execução quando a atualização começou.</td>
      </tr>
      <tr>
         <th>Nome do serviço</th>
         <td>mysql</td>
         <td>
            <p>Para RHEL, Oracle Linux, CentOS e Fedora:<strong>mysqld</strong></p>
            <p>Para SLES:<strong>mysql</strong></p>
         </td>
      </tr>
      <tr>
         <th>Arquivo de registro de erros</th>
         <td>Em [[<code>/var/lib/mysql/<em><code>hostname</code>]]</em>.err</code></td>
         <td>
            <p>Para RHEL, Oracle Linux, CentOS e Fedora: em [[<code>/var/log/mysqld.log</code>]]</p>
            <p>Para SLES: em [[<code>/var/log/mysql/mysqld.log</code>]]</p>
         </td>
      </tr>
      <tr>
         <th>Fornecido com o arquivo [[<code>/etc/my.cnf</code>]]</th>
         <td>Não</td>
         <td>Sim</td>
      </tr>
      <tr>
         <th>Suporte Multilib</th>
         <td>Não</td>
         <td>Sim</td>
      </tr>
   </tbody>
</table>

::: info Nota
A instalação de versões anteriores do MySQL usando pacotes mais antigos pode ter criado um arquivo de configuração chamado `/usr/my.cnf`. É altamente recomendável que você examine o conteúdo do arquivo e migre as configurações desejadas para o arquivo `/etc/my.cnf`, depois remova o `/usr/my.cnf`.
:::

**Atualização para o MySQL Enterprise Server.** Para fazer a atualização de uma versão comunitária para uma versão comercial do MySQL, você deve primeiro desinstalar a versão comunitária e, em seguida, instalar a versão comercial. Nesse caso, você deve reiniciar o servidor manualmente após a atualização.

**Interoperabilidade com os pacotes nativos do MySQL do sistema operacional.** Muitas distribuições Linux incluem o MySQL como parte integrada do sistema operacional. As últimas versões dos RPMs da Oracle, quando instaladas usando a ferramenta padrão de gerenciamento de pacotes (**yum**, **dnf** ou **zypper**), atualizam e substituem perfeitamente a versão do MySQL que vem com o sistema operacional, e o gerenciador de pacotes substitui automaticamente os pacotes de compatibilidade do sistema, como `mysql-community-libs-compat`, pelas novas versões relevantes.

**Atualização de pacotes MySQL não nativos.** Se você instalou o MySQL com pacotes de terceiros NÃO do repositório de software nativo da sua distribuição Linux (por exemplo, pacotes baixados diretamente do fornecedor), você deve desinstalar todos esses pacotes antes de poder fazer a atualização usando os pacotes da Oracle.
