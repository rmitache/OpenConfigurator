using OpenConfigurator.Core.Configuration.BLOs;
using OpenConfigurator.Core.Modelling.BLOs;
using Antlr4.Runtime;
using Antlr4.Runtime.Tree;
using System.Collections.Generic;

namespace OpenConfigurator.Core.Configuration.BLOManagers.Parser
{
    public class ParserEngine
    {
        // Fields
        private ConfigurationInstance configInstance;


        // Constructor 
        public ParserEngine(ConfigurationInstance configInstance)
        {
            this.configInstance = configInstance;
        }

        // Public methods
        public FeatureSelection Execute(CustomRule targetCustomRule)
        {
            // Get the expression
            string expr = ">root.TotalScore=SumOf(>root.>descendants.ScoreValue)"; //TargetCustomFunction.Expression;

            // Parse the expression
            AntlrInputStream inputToParse = new AntlrInputStream(expr);
            GrammarLexer lexer = new GrammarLexer(inputToParse);
            CommonTokenStream tokens = new CommonTokenStream(lexer);
            GrammarParser grammarParser = new GrammarParser(tokens);
            IParseTree tree = grammarParser.prog();
            Visitor visitor = new Visitor(configInstance);

            // Execute it and return the parent FeatureSelection of the modified AttributeValue (left side of the expression)
            var result = visitor.Visit(tree);
            return result as FeatureSelection;
        }

    }
}
