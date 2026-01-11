### 2.3.1 Estrutura de instalação do MySQL no Microsoft Windows

Para o MySQL 5.7 no Windows, o diretório de instalação padrão é `C:\Program Files\MySQL\MySQL Server 5.7` para instalações realizadas com o MySQL Installer. Se você usar o método de arquivo ZIP para instalar o MySQL, pode preferir instalá-lo em `C:\mysql`. No entanto, o layout dos subdiretórios permanece o mesmo.

Todos os arquivos estão localizados dentro deste diretório pai, usando a estrutura mostrada na tabela a seguir.

**Tabela 2.4 Estrutura padrão de instalação do MySQL para Microsoft Windows**

<table>
   <thead>
      <tr>
         <th>Diretório</th>
         <th>Conteúdo do diretório</th>
         <th>Notas</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th><code>bin</code></th>
         <td><span><strong>mysqld</strong></span> programas de servidor, cliente e utilitário</td>
         <td></td>
      </tr>
      <tr>
         <th><code>%PROGRAMDATA%\MySQL\MySQL Server 5.7\</code></th>
         <td>Arquivos de registro, bancos de dados</td>
         <td>A variável de sistema do Windows <code>%PROGRAMDATA%</code> tem como padrão <code>C:\ProgramData</code>.</td>
      </tr>
      <tr>
         <th><code>docs</code></th>
         <td>Documentação de lançamento</td>
         <td>Com o Instalador do MySQL, use a operação <code>Modify</code> para selecionar esta pasta opcional.</td>
      </tr>
      <tr>
         <th><code>include</code></th>
         <td>Incluir arquivos (cabeçalho)</td>
         <td></td>
      </tr>
      <tr>
         <th><code>lib</code></th>
         <td>Livrarias</td>
         <td></td>
      </tr>
      <tr>
         <th><code>share</code></th>
         <td>Arquivos de suporte variados, incluindo mensagens de erro, arquivos de conjunto de caracteres, arquivos de configuração de exemplo, SQL para instalação de banco de dados</td>
         <td></td>
      </tr>
   </tbody>
</table>
