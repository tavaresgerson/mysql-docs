### 2.8.10 Geração de conteúdo de documentação do MySQL Doxygen

O código fonte do MySQL contém documentação interna escrita usando o Doxygen. O conteúdo do Doxygen gerado está disponível em \[<https://dev.mysql.com/doc/index-other.html>]<https://dev.mysql.com/doc/index-other.html>] Também é possível gerar esse conteúdo localmente a partir de uma distribuição de fonte do MySQL usando o seguinte procedimento:

1. Instale o `doxygen` 1.9.2 ou posterior. As distribuições estão disponíveis aqui em <http://www.doxygen.nl/>.

   Depois de instalar o `doxygen`, verifique o número de versão:

   ```
   $> doxygen --version
   1.9.2
   ```
2. Instalar PlantUML.

   Quando você instala o PlantUML no Windows (testado no Windows 10), você deve executá-lo pelo menos uma vez como administrador para que ele crie as chaves de registro. Abra um console de administrador e execute este comando:

   ```
   $> java -jar path-to-plantuml.jar
   ```

   O comando deve abrir uma janela de GUI e não retornar erros no console.
3. Defina o ambiente `PLANTUML_JAR_PATH` para o local onde você instalou o PlantUML. Por exemplo:

   ```
   $> export PLANTUML_JAR_PATH=path-to-plantuml.jar
   ```
4. Instale o comando `dot` do Graphviz.

   Depois de instalar o Graphviz, verifique a disponibilidade do `dot`.

   ```
   $> which dot
   /usr/bin/dot

   $> dot -V
   dot - graphviz version 2.40.1 (20161225.0304)
   ```
5. Altere a localização para o diretório de nível superior da sua distribuição de origem MySQL e faça o seguinte:

   Primeiro, execute `cmake`:

   ```
   $> cd mysql-source-directory
   $> mkdir build
   $> cd build
   $> cmake ..
   ```

   Em seguida, gera a documentação `doxygen`:

   ```
   $> make doxygen
   ```

   Inspecione o registro de erros, que está disponível no arquivo `doxyerror.log` no diretório de nível superior. Assumindo que a compilação foi executada com sucesso, veja a saída gerada usando um navegador. Por exemplo:

   ```
   $> firefox doxygen/html/index.html
   ```
